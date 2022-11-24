import { encodeAnyAddress, planckToTokens } from '@talismn/util'
import { Field, ObjectType } from 'type-graphql'

import { githubUnknownTokenLogoUrl, nativeTokens } from '../tokens'
import { EventMap } from './types'
import { ParsedTxBase, withToken } from './_common'

// (1/3) define and map each event to a parsed type here

export const eventMap: EventMap<typeof ParsedTxs> = {
  'Staking.Bonded': (tx) => {
    const { extrinsic } = tx._data || {}

    // handle array args
    let args = tx.args
    args = Array.isArray(args) ? { staker: args[0], amount: args[1] } : args

    const tokenDecimals = nativeTokens[tx.chainId]?.decimals ?? 0
    const nativeTokenDecimals = tokenDecimals

    return new ParsedStake({
      chainId: tx.chainId,
      tokenLogo: nativeTokens[tx.chainId]?.logo ?? githubUnknownTokenLogoUrl,
      tokenSymbol: nativeTokens[tx.chainId]?.symbol ?? '???',
      tokenDecimals,
      staker: args?.staker && encodeAnyAddress(args?.staker, tx.ss58Format),
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

export const ParsedTxs = () => [ParsedStake] as const

// (3/3) define each parsed type here

@ObjectType()
export class ParsedStake extends withToken(ParsedTxBase) {
  constructor(props: ParsedStake) {
    super()
    Object.assign(this, props)
  }

  /** source: event */
  @Field({ nullable: true })
  staker?: string

  /** source: event */
  @Field()
  amount!: string
}
