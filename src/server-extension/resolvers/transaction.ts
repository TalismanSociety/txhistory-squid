import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager, LessThan, MoreThan, Brackets } from 'typeorm'
import padStart from 'lodash/padStart'
import { Event, IndexedChain } from '../../model'
import { deepConvertBigIntToString, isAddress, JsonScalar, safeFormatAddress } from '../../util'

import { ParsedTransactionUnion, parseTransaction } from '../../tx-parser'

// how many items to return at a time
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 20

@ObjectType()
class Transaction {
  constructor(props: Transaction) {
    Object.assign(this, props)
  }

  /** event id */
  @Field(() => String)
  id!: string

  /** event pallet and method */
  @Field(() => String, { nullable: true })
  name!: string | undefined | null

  /** chain id */
  @Field(() => String)
  chainId!: string
  /** chain account format */
  @Field(() => Number)
  ss58Format!: number

  /** block number */
  @Field(() => Number)
  blockNumber!: number
  /** block hash */
  @Field(() => String)
  blockHash!: string
  /** block timestamp */
  @Field(() => Date)
  timestamp!: Date

  /** event args */
  @Field(() => JsonScalar, { nullable: true })
  args!: unknown | undefined | null

  /** extrinsic signer (derived from `signature`) */
  @Field(() => String, { nullable: true })
  signer!: string | undefined | null

  /** queried addresses found in the event */
  @Field(() => [String])
  relatedAddresses!: string[]

  /**
   * block explorer url for this tx
   */
  @Field(() => String, { nullable: true })
  explorerUrl: string | undefined | null

  /** the calls and extrinsic associated with the event */
  @Field(() => JsonScalar, { nullable: true })
  _data!: unknown | undefined | null

  @Field(() => ParsedTransactionUnion, { nullable: true })
  parsed!: typeof ParsedTransactionUnion | null
}

@Resolver()
export class TransactionResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [Transaction])
  async transactionsByAddress(
    @Arg('query', () => String, { nullable: true }) searchQuery: string,
    @Arg('addresses', () => [String], { nullable: true }) reqAddresses: string[],
    @Arg('chains', () => [String], { nullable: true, defaultValue: [] }) chains: string[],
    @Arg('limit', { nullable: true, defaultValue: DEFAULT_LIMIT }) limit: number,
    @Arg('newerThanId', { nullable: true, defaultValue: null }) newerThanId: string,
    @Arg('olderThanId', { nullable: true, defaultValue: null }) olderThanId: string
  ): Promise<Transaction[]> {
    const manager = await this.tx()

    const search = parseSearchQuery(searchQuery)

    const addresses = (
      search.addresses.length > 0
        ? // use the addresses from the searchQuery if some are present
          search.addresses
        : // otherwise use the addresses from the addresses parameter
          reqAddresses ?? []
    )
      // encode the incoming addresses to the generic format we use in the db
      .map(safeFormatAddress)

    // check that the limit isn't outside of the range 0 to MAX_LIMIT
    if (limit < 0) limit = 0
    if (limit > MAX_LIMIT) limit = MAX_LIMIT

    // the query to fetch the TXs based on address
    let query = manager
      .getRepository(Event)
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.block', 'block')
      .leftJoinAndSelect('event.extrinsic', 'extrinsic')
      .leftJoinAndSelect('event.call', 'call')
      .leftJoinAndSelect('call.parent', 'parentCall')
      .leftJoinAndSelect('event.relatedAddresses', 'address_event')
      .orderBy({ 'event.id': 'DESC' })
      .take(limit)

    if (addresses.length > 0) query = query.andWhere('address_event.address_id IN (:...addresses)', { addresses })
    if (chains.length > 0) query = query.andWhere('block.chain_id IN (:...chains)', { chains })
    if (olderThanId !== null) query = query.andWhere({ id: LessThan(olderThanId) })
    if (newerThanId !== null) query = query.andWhere({ id: MoreThan(newerThanId) }).orderBy({ 'event.id': 'ASC' })

    if (search.partials.length > 0) {
      const { partials } = search
      const partialsLike = `%(${partials.map((partial) => `%${partial}%`).join('|')})%`
      query = query.andWhere(
        new Brackets((query) =>
          query
            .where(`LOWER(event.name) SIMILAR TO (:partialsLike)`, { partialsLike })
            .orWhere(`LOWER(call.name) SIMILAR TO (:partialsLike)`, { partialsLike })
            .orWhere(`LOWER(parentCall.name) SIMILAR TO (:partialsLike)`, { partialsLike })
            .orWhere(`LOWER(block.chain_id) SIMILAR TO (:partialsLike)`, { partialsLike })
            .orWhere(`extrinsic.hash IN (:...partials)`, { partials })
            .orWhere(`extrinsic.signer IN (:...partials)`, { partials })
        )
      )
    }
    if (search.blockNumbers.length > 0) {
      query = query.andWhere('block.block_number IN (:...blockNumbers)', { blockNumbers: search.blockNumbers })
    }

    console.debug(
      `Executing query with parameters ${JSON.stringify({
        addresses,
        limit,
        olderThanId,
        newerThanId,
      })}\n :: ${query.getQueryAndParameters()}`
    )

    // fetch the result
    // also fetch indexedChains for subscanUrl/calamarUrl lookups
    const [result, indexedChains] = await Promise.all([
      query.getMany(),
      (async () =>
        Object.fromEntries(
          (await manager.find(IndexedChain)).map((indexedChain) => [indexedChain.id, indexedChain])
        ))(),
    ])

    // format results
    const resultFormatted = result
      .map((event) => {
        const { subscanUrl, calamarUrl } = indexedChains[event.block.chainId] || {}

        const blockNumber = event.block.blockNumber
        const blockHash = event.block.blockHash
        const extrinsicIndexInBlock = event.extrinsic?.indexInBlock

        const paddedBlockNumber = padStart(blockNumber.toString(10), 10, '0')
        const trimmedBlockHash = blockHash.replace(/^0x/, '').slice(0, 5)
        const paddedExtrinsicIndexInBlock =
          typeof extrinsicIndexInBlock === 'number' ? padStart(extrinsicIndexInBlock.toString(10), 6, '0') : undefined

        const explorerUrl =
          typeof subscanUrl === 'string' && typeof extrinsicIndexInBlock === 'number'
            ? `${subscanUrl}/extrinsic/${blockNumber}-${extrinsicIndexInBlock}?event=${blockNumber}-${event.indexInBlock}`
            : typeof subscanUrl === 'string'
            ? `${subscanUrl}/extrinsic/${blockNumber}`
            : typeof calamarUrl === 'string' && typeof extrinsicIndexInBlock === 'number'
            ? `${calamarUrl}/extrinsic/${paddedBlockNumber}-${paddedExtrinsicIndexInBlock}-${trimmedBlockHash}`
            : typeof calamarUrl === 'string'
            ? `${calamarUrl}/block/${paddedBlockNumber}-${trimmedBlockHash}`
            : null

        return [event, explorerUrl] as const
      })
      .map<Transaction>(([event, explorerUrl]) => ({
        id: event.id,

        name: event.name,

        chainId: event.block.chainId,
        ss58Format: event.block.ss58Format,

        blockNumber: event.block.blockNumber,
        blockHash: event.block.blockHash,
        timestamp: event.block.timestamp,

        args: event.args,

        signer: event.extrinsic?.signer ? safeFormatAddress(event.extrinsic?.signer) : undefined,

        relatedAddresses: (event.relatedAddresses || []).map((join) => join.id.split('-')[0]),

        explorerUrl,

        _data: deepConvertBigIntToString({ call: event.call, extrinsic: event.extrinsic }),

        parsed: null,
      }))
      .map((tx) => {
        tx.parsed = parseTransaction(tx)

        return tx
      })

    return resultFormatted
  }
}

function parseSearchQuery(searchQuery: string | undefined) {
  const addresses: string[] = []
  const blockNumbers: number[] = []
  const partials: string[] = []

  for (const part of (searchQuery ?? '').replace(/ +/gm, ' ').trim().split(' ')) {
    const isInt = (part: string) => parseInt(part, 10).toString() === part
    if (isInt(part)) {
      // number search
      blockNumbers.push(parseInt(part, 10))
    } else if (isAddress(part)) {
      // address search
      addresses.push(safeFormatAddress(part))
    } else {
      // generic string partial search
      partials.push(part.toLowerCase())
    }
  }

  return { addresses, blockNumbers, partials }
}
