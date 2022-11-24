import sortedUniq from 'lodash/sortedUniq'
import { createUnionType } from 'type-graphql'

// (1/3) import and export each module here

import * as Transfer from './transfer'
export * as Transfer from './transfer'

import * as Crowdloan from './crowdloan'
export * as Crowdloan from './crowdloan'

import * as Staking from './staking'
export * as Staking from './staking'

import * as Dex from './dex'
export * as Dex from './dex'

import * as Identity from './identity'
export * as Identity from './identity'

import * as Ethereum from './ethereum'
export * as Ethereum from './ethereum'

import * as Other from './other'
export * as Other from './other'

// (2/3) add each module to this tuple,
// if a module is missing from here then the processor won't fetch its events

export const AllModules = [Transfer, Crowdloan, Staking, Dex, Identity, Ethereum, Other] as const

// (3/3) also add each module to this tuple,
// if a module is missing from here then its parsed tx types won't be available in the graphql api schema

export const AllParsedTypes = [
  ...Transfer.ParsedTxs(),
  ...Crowdloan.ParsedTxs(),
  ...Staking.ParsedTxs(),
  ...Dex.ParsedTxs(),
  ...Identity.ParsedTxs(),
  ...Ethereum.ParsedTxs(),
  ...Other.ParsedTxs(),
] as const

export const AllEvents = sortedUniq(AllModules.flatMap((module) => Object.keys(module.eventMap)))

export const ParsedTransactionUnion = createUnionType({
  name: 'ParsedTransaction',
  types: () => AllParsedTypes,
})

// TODO: Add `Transaction` type instead of `T extends ...`
export const parseTransaction = <T extends { name: string | null | undefined }>(
  tx: T
): InstanceType<typeof AllParsedTypes[number]> | null => {
  if (!tx.name) return null

  for (const mod of AllModules) {
    const parser = mod.eventMap[tx.name]
    if (!parser) continue

    return parser(tx)
  }

  return null
}
