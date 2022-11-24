import {
  SubstrateBatchProcessor,
  SubstrateBlock,
  SubstrateCall,
  SubstrateEvent,
  SubstrateExtrinsic,
} from '@subsquid/substrate-processor'
import { DataSelection, EventDataRequest } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import omit from 'lodash/omit'

import { Address, AddressEvent, Block, Call, Event, Extrinsic, IndexedChain } from '../model'
import { AllEvents } from '../tx-parser'
import { deepConvertBigIntToString, deepParseAddresses, safeFormatAddress } from '../util'

const eventParams: DataSelection<EventDataRequest> = {
  data: {
    event: {
      // id: true,
      // name: true,
      // pos: true,
      args: true,
      indexInBlock: true,
      phase: true,
      call: {
        // id: true,
        // name: true,
        // success: true,
        // pos: true,
        args: true,
        error: true,
        origin: true,
        parent: true,
      },
      extrinsic: {
        // id: true,
        // pos: true,
        indexInBlock: true,
        version: true,
        signature: true,
        success: true,
        error: true,
        hash: true,
        fee: true,
        tip: true,
        call: {
          args: true,
          error: true,
          origin: true,
          parent: true,
        },
      },
    },
  },
}

const createProcessor = ({ id, archive, startBlock }: IndexedChain, index: number) => {
  if (typeof archive !== 'string') throw new Error(`No archive found for chain ${id}`)

  const processor = new SubstrateBatchProcessor()
    .setDataSource({ archive })
    .setBlockRange({ from: startBlock || 0 })
    .setPrometheusPort(30_000 + index)

  AllEvents.forEach((event) => processor.addEvent(event, eventParams))

  return processor
}

export function runProcessor(chain: IndexedChain, index: number) {
  const { id: chainId, ss58Format } = chain

  createProcessor(chain, index).run(
    new TypeormDatabase({ stateSchema: chainId, isolationLevel: 'READ COMMITTED' }),
    async (ctx) => {
      const calls: Record<Call['id'], Call> = {}
      const parentCallIdsMap: Record<Call['id'], true> = {}
      const extrinsics: Record<Extrinsic['id'], Extrinsic> = {}
      const events: Record<Event['id'], Event> = {}
      const addresses: Record<Address['id'], Address> = {}
      const addressEvents: Record<AddressEvent['id'], AddressEvent> = {}
      const blocks: Record<Block['id'], Block> = {}

      const addBlock = (item: SubstrateBlock): Block => {
        const id = `${chainId}-${item.id}`
        const block = blocks[id] ?? new Block({ id })
        blocks[id] = block

        block.blockNumber = item.height
        block.blockHash = item.hash
        block.timestamp = new Date(item.timestamp)

        block.chainId = chainId
        block.ss58Format = ss58Format ?? 42

        return block
      }
      const addAddress = (item: string): Address => {
        const id = safeFormatAddress(item)
        const address = addresses[id] ?? new Address({ id })
        addresses[id] = address

        return address
      }
      const addEvent = (item: SubstrateEvent, block: SubstrateBlock): Event => {
        const id = `${block.timestamp}-${chainId}-${item.id}`
        const event = events[id] ?? new Event({ id })
        events[event.id] = event

        event.name = item.name
        event.args = deepConvertBigIntToString(item.args)
        event.phase = item.phase
        event.indexInBlock = item.indexInBlock

        for (const addressString of deepParseAddresses(omit(item, ['call', 'extrinsic']))) {
          const address = addAddress(addressString)

          const joinId = `${address.id}-${id}`
          const addressEvent = new AddressEvent({ id: joinId })
          addressEvents[addressEvent.id] = addressEvent

          addressEvent.address = address
          addressEvent.event = event
        }

        event.block = addBlock(block)
        if (item.call) event.call = addCall(item.call, block)
        if (item.extrinsic) event.extrinsic = addExtrinsic(item.extrinsic, block)

        return event
      }
      const addCall = (item: SubstrateCall, block: SubstrateBlock): Call => {
        const id = `${block.timestamp}-${chainId}-${item.id}`
        const call = calls[id] ?? new Call({ id })
        calls[call.id] = call

        call.name = item.name
        call.data = deepConvertBigIntToString(omit(item, 'parent'))

        call.block = addBlock(block)
        if (item.parent) {
          call.parent = addCall(item.parent, block)
          parentCallIdsMap[call.parent.id] = true
        }

        return call
      }
      const addExtrinsic = (item: SubstrateExtrinsic, block: SubstrateBlock): Extrinsic => {
        const id = `${block.timestamp}-${chainId}-${item.id}`
        const extrinsic = extrinsics[id] ?? new Extrinsic({ id })
        extrinsics[extrinsic.id] = extrinsic

        extrinsic.version = item.version
        extrinsic.hash = item.hash
        extrinsic.indexInBlock = item.indexInBlock
        extrinsic.fee = item.fee
        extrinsic.tip = item.tip
        extrinsic.success = item.success
        extrinsic.error = item.error

        extrinsic.signer =
          typeof item.signature?.address !== 'string' && 'value' in (item.signature?.address || {})
            ? item.signature?.address.value
            : item.signature?.address

        extrinsic.signature =
          typeof item.signature?.signature !== 'string' && 'value' in (item.signature?.signature || {})
            ? item.signature?.signature.value
            : item.signature?.signature
        extrinsic.signatureType =
          typeof item.signature?.signature !== 'string' && '__kind' in (item.signature?.signature || {})
            ? item.signature?.signature.__kind
            : undefined

        extrinsic.block = addBlock(block)
        if (item.call) extrinsic.call = addCall(item.call, block)

        return extrinsic
      }

      for (const block of ctx.blocks) {
        for (const item of block.items) {
          if (item.kind === 'event') addEvent(item.event as SubstrateEvent, block.header) // TODO: Remove the typecast
          else if (item.kind === 'call') addCall(item.call as SubstrateCall, block.header) // TODO: Remove the typecast
          else {
            const exhaustiveCheck: never = item
            ctx.log.error(`Unhandled item type ${exhaustiveCheck}`)
          }
        }
      }

      const parentCallIds = Object.keys(parentCallIdsMap)
      const otherCallIds = Object.keys(calls).filter((id) => !parentCallIdsMap[id])

      await ctx.store.save(Object.values(blocks))
      await ctx.store.save(Object.values(addresses))

      // need to save parent calls before normal calls in order to avoid the following error:
      // `Key (parent_id)=(polkadot-0010709926-000028-782cb) is not present in table "call".`
      await ctx.store.save(parentCallIds.map((id) => calls[id]))
      await ctx.store.save(otherCallIds.map((id) => calls[id]))

      await ctx.store.save(Object.values(extrinsics))
      await ctx.store.save(Object.values(events))
      await ctx.store.save(Object.values(addressEvents))
    }
  )
}
