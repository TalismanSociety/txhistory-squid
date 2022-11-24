import { encodeAnyAddress, planckToTokens } from '@talismn/util'
import { Field, ObjectType } from 'type-graphql'

import { nativeTokens, githubUnknownTokenLogoUrl } from '../tokens'
import { EventMap } from './types'
import { ParsedTxBase, withToken } from './_common'

export const eventMap: EventMap<typeof ParsedTxs> = {
  'Ethereum.Executed': (tx) => {
    const { extrinsic, call } = tx._data || {}

    // handle array args
    let args = tx.args
    args = Array.isArray(args) ? { from: args[0], to: args[1], transactionHash: args[2], exitReason: args[3] } : args

    const tokenDecimals = nativeTokens[tx.chainId]?.decimals ?? 0
    const nativeTokenDecimals = tokenDecimals

    const amount =
      call?.name === 'Ethereum.transact' ? (call?.data?.args?.transaction?.value?.value || [])[0] ?? '0' : '0'

    const success = extrinsic?.success && args?.exitReason?.__kind === 'Succeed'

    return new ParsedEthereumExec({
      chainId: tx.chainId,
      tokenLogo: nativeTokens[tx.chainId]?.logo ?? githubUnknownTokenLogoUrl,
      tokenSymbol: nativeTokens[tx.chainId]?.symbol ?? '???',
      tokenDecimals,
      from: args?.from && encodeAnyAddress(args?.from, tx.ss58Format),
      to: args?.to && encodeAnyAddress(args?.to, tx.ss58Format),
      amount: planckToTokens(amount, tokenDecimals),
      fee: planckToTokens(extrinsic?.fee, nativeTokenDecimals),
      tip: planckToTokens(extrinsic?.tip, nativeTokenDecimals),
      success,
    })
  },
}

export const ParsedTxs = () => [ParsedEthereumExec] as const

@ObjectType()
export class ParsedEthereumExec extends withToken(ParsedTxBase) {
  constructor(props: ParsedEthereumExec) {
    super()
    Object.assign(this, props)
  }

  /** source: event */
  @Field()
  from!: string

  /** source: event */
  @Field()
  to!: string

  /** source: call */
  @Field()
  amount!: string
}
