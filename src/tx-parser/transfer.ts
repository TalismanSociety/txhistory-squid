import { encodeAnyAddress, planckToTokens } from '@talismn/util'
import { Field, ObjectType } from 'type-graphql'

import { nativeTokens, githubUnknownTokenLogoUrl } from '../tokens'
import { EventMap } from './types'
import { ParsedTxBase, withToken } from './_common'

// (1/3) define and map each event to a parsed type here

export const eventMap: EventMap<typeof ParsedTxs> = {
  // e.g. https://kusama.subscan.io/extrinsic/14234788-5
  'Balances.Transfer': (tx) => {
    const { extrinsic } = tx._data || {}

    // handle array args
    let args = tx.args
    args = Array.isArray(args) ? { from: args[0], to: args[1], amount: args[2] } : args

    const tokenDecimals = nativeTokens[tx.chainId]?.decimals ?? 0
    const nativeTokenDecimals = tokenDecimals

    return new ParsedTransfer({
      chainId: tx.chainId,
      tokenLogo: nativeTokens[tx.chainId]?.logo ?? githubUnknownTokenLogoUrl,
      tokenSymbol: nativeTokens[tx.chainId]?.symbol ?? '???',
      tokenDecimals,
      from: args?.from && encodeAnyAddress(args?.from, tx.ss58Format),
      to: args?.to && encodeAnyAddress(args?.to, tx.ss58Format),
      amount: planckToTokens(args?.amount, tokenDecimals),
      fee: planckToTokens(extrinsic?.fee, nativeTokenDecimals),
      tip: planckToTokens(extrinsic?.tip, nativeTokenDecimals),
      success: extrinsic?.success || false,
    })
  },
}

// (2/3) add each parsed type to this tuple
// if a parsed type is missing from this tuple:
//   1. typescript won't allow you to use the missing type in the eventMap above
//   2. the type will also be missing from the graphql api schema

export const ParsedTxs = () => [ParsedTransfer] as const

// (3/3) define each parsed type here

@ObjectType()
export class ParsedTransfer extends withToken(ParsedTxBase) {
  constructor(props: ParsedTransfer) {
    super()
    Object.assign(this, props)
  }

  /** source: event */
  @Field()
  from!: string

  /** source: event */
  @Field()
  to!: string

  /** source: event */
  @Field()
  amount!: string
}
