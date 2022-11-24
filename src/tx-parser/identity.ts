import { planckToTokens } from '@talismn/util'
import { Field, ObjectType } from 'type-graphql'

import { JsonScalar } from '../util'
import { nativeTokens, githubUnknownTokenLogoUrl } from '../tokens'
import { EventMap } from './types'
import { ParsedTxBase, withToken } from './_common'

// (1/3) define and map each event to a parsed type here

export const eventMap: EventMap<typeof ParsedTxs> = {
  'Identity.IdentitySet': (tx) => {
    const { extrinsic, call } = tx._data || {}

    // handle array args
    let args = tx.args
    args = Array.isArray(args) ? { from: args[0], to: args[1], amount: args[2] } : args

    // handle call args
    const info = call?.data?.args?.info || {}

    const tokenDecimals = nativeTokens[tx.chainId]?.decimals ?? 0
    const nativeTokenDecimals = tokenDecimals

    return new ParsedSetIdentity({
      chainId: tx.chainId,
      tokenLogo: nativeTokens[tx.chainId]?.logo ?? githubUnknownTokenLogoUrl,
      tokenSymbol: nativeTokens[tx.chainId]?.symbol ?? '???',
      tokenDecimals,
      info,
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

export const ParsedTxs = () => [ParsedSetIdentity] as const

// (3/3) define each parsed type here

@ObjectType()
export class ParsedSetIdentity extends withToken(ParsedTxBase) {
  constructor(props: ParsedSetIdentity) {
    super()
    Object.assign(this, props)
  }

  @Field(() => JsonScalar)
  info!: JSON
}
