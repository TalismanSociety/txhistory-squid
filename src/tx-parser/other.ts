import { encodeAnyAddress, planckToTokens } from '@talismn/util'
import { Field, ObjectType } from 'type-graphql'

import { nativeTokens, githubUnknownTokenLogoUrl } from '../tokens'
import { EventMap } from './types'
import { ParsedTxBase, withToken } from './_common'

const referendumUrlPrefixes: Record<string, string> = {
  polkadot: 'https://polkadot.polkassembly.io/referendum',
  kusama: 'https://kusama.polkassembly.io/referendum',
}

export const eventMap: EventMap<typeof ParsedTxs> = {
  'Democracy.Voted': (tx) => {
    const { extrinsic } = tx._data || {}

    // handle array args
    let args = tx.args
    args = Array.isArray(args) ? { vote: args[0], voter: args[1], refIndex: args[2] } : args

    const tokenDecimals = nativeTokens[tx.chainId]?.decimals ?? 0
    const nativeTokenDecimals = tokenDecimals

    return new ParsedVote({
      chainId: tx.chainId,
      tokenLogo: nativeTokens[tx.chainId]?.logo ?? githubUnknownTokenLogoUrl,
      tokenSymbol: nativeTokens[tx.chainId]?.symbol ?? '???',
      tokenDecimals,
      voter: args?.voter && encodeAnyAddress(args?.voter, tx.ss58Format),
      referendumIndex: args.refIndex,
      referendumUrl:
        referendumUrlPrefixes[tx.chainId] !== undefined
          ? `${referendumUrlPrefixes[tx.chainId]}/${args.refIndex}`
          : undefined,
      voteNumber: typeof args.vote === 'object' && args.vote?.__kind === 'Standard' ? args.vote?.vote : 'Unknown',
      amount: planckToTokens(
        typeof args.vote === 'object' && args.vote?.__kind === 'Standard' ? args.vote?.balance : -1,
        tokenDecimals
      ),
      fee: planckToTokens(extrinsic?.fee, nativeTokenDecimals),
      tip: planckToTokens(extrinsic?.tip, nativeTokenDecimals),
      success: extrinsic?.success || false,
    })
  },
}

export const ParsedTxs = () => [ParsedVote] as const

@ObjectType()
export class ParsedVote extends withToken(ParsedTxBase) {
  constructor(props: ParsedVote) {
    super()
    Object.assign(this, props)
  }

  /** source: event */
  @Field()
  voter!: string

  /** source: event */
  @Field()
  referendumIndex!: string

  /** source: tba (hardcoded for now) */
  @Field({ nullable: true })
  referendumUrl?: string

  /** source: event */
  @Field()
  voteNumber!: string

  /** source: event */
  @Field()
  amount!: string
}
