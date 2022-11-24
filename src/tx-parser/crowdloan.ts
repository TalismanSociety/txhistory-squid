import { encodeAnyAddress, planckToTokens } from '@talismn/util'
import { Field, Int, ObjectType } from 'type-graphql'

import { githubUnknownTokenLogoUrl, nativeTokens } from '../tokens'
import { EventMap } from './types'
import { ParsedTxBase, withToken } from './_common'

// (1/3) define and map each event to a parsed type here

export const eventMap: EventMap<typeof ParsedTxs> = {
  'Crowdloan.Contributed': (tx) => {
    const { extrinsic } = tx._data || {}

    // handle array args
    let args = tx.args
    args = Array.isArray(args) ? { who: args[0], fundIndex: args[1], amount: args[2] } : args

    const tokenDecimals = nativeTokens[tx.chainId]?.decimals ?? 0
    const nativeTokenDecimals = tokenDecimals

    return new ParsedCrowdloanContribute({
      chainId: tx.chainId,
      tokenLogo: nativeTokens[tx.chainId]?.logo ?? githubUnknownTokenLogoUrl,
      tokenSymbol: nativeTokens[tx.chainId]?.symbol ?? '???',
      tokenDecimals,
      contributor: args?.who && encodeAnyAddress(args?.who, tx.ss58Format),
      amount: planckToTokens(args?.amount, tokenDecimals),
      // TODO: look up fund info (e.g. parachain name)
      fund: args?.fundIndex,
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

export const ParsedTxs = () => [ParsedCrowdloanContribute] as const

// (3/3) define each parsed type here

@ObjectType()
export class ParsedCrowdloanContribute extends withToken(ParsedTxBase) {
  constructor(props: ParsedCrowdloanContribute) {
    super()
    Object.assign(this, props)
  }

  /** source: event */
  @Field()
  contributor!: string

  /** source: event */
  @Field()
  amount!: string

  /**
   * TODO: look up fund info (e.g. parachain name)
   * source: event
   */
  @Field(() => Int)
  fund!: number
}
