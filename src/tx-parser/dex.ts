import { encodeAnyAddress, planckToTokens } from '@talismn/util'
import isEqual from 'lodash/isEqual'
import { Field, Int, ObjectType } from 'type-graphql'

import { nativeTokens, ormlTokens, githubUnknownTokenLogoUrl } from '../tokens'
import { EventMap } from './types'
import { ParsedTxBase } from './_common'

// (1/3) define and map each event to a parsed type here

export const eventMap: EventMap<typeof ParsedTxs> = {
  // e.g. https://acala.subscan.io/extrinsic/1673472-5?event=1673472-26
  'Dex.Swap': (tx) => {
    const { extrinsic } = tx._data || {}

    // handle array args
    let args = tx.args
    args = Array.isArray(args) ? { path: args[0], trader: args[1], liquidityChanges: args[2] } : args

    const tokenDecimals = nativeTokens[tx.chainId]?.decimals ?? 0
    const nativeTokenDecimals = tokenDecimals

    return new ParsedSwap({
      chainId: tx.chainId,
      tokens: args.path.map((currencyId: any, index: number) => {
        const token = Object.values(ormlTokens)
          .filter(({ chainId }) => tx.chainId === chainId)
          .find(({ onChainFormat }) => isEqual(currencyId, onChainFormat))

        const decimals = token?.decimals ?? 0

        return new ParsedSwapToken({
          logo: token?.logo ?? githubUnknownTokenLogoUrl,
          symbol: token?.symbol ?? '???',
          decimals,
          liquidityChange: planckToTokens(args.liquidityChanges[index] ?? 0, decimals),
        })
      }),
      trader: args.trader && encodeAnyAddress(args.trader, tx.ss58Format),
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

export const ParsedTxs = () => [ParsedSwap] as const

// (3/3) define each parsed type here

@ObjectType()
export class ParsedSwap extends ParsedTxBase {
  constructor(props: ParsedSwap) {
    super()
    Object.assign(this, props)
  }

  /** source: event */
  @Field(() => [ParsedSwapToken])
  tokens!: Array<ParsedSwapToken>

  /** source: event */
  @Field()
  trader!: string
}
@ObjectType()
export class ParsedSwapToken {
  constructor(props: ParsedSwapToken) {
    Object.assign(this, props)
  }

  /** source: tba (hardcoded for now) */
  @Field()
  logo!: string

  /** source: tba (hardcoded for now) */
  @Field()
  symbol!: string

  /** source: tba (hardcoded for now) */
  @Field(() => Int)
  decimals!: number

  /** source: event */
  @Field()
  liquidityChange!: string
}
