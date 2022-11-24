import { isEthereumAddress, validateAddress } from '@polkadot/util-crypto'
import * as ss58 from '@subsquid/ss58'
import { Store } from '@subsquid/typeorm-store'
import { decodeHex, isHex } from '@subsquid/util-internal-hex'
import { GraphQLScalarType, Kind } from 'graphql'
import { FindOptionsWhere } from 'typeorm'

import { bigint } from './model/generated/marshal'

export const findOrCreate = async <T extends { id: string }>(
  store: Store,
  entityConstructor: { new (...args: any[]): T },
  id: string
) =>
  (await store.findOne<T>(entityConstructor, { where: { id } as FindOptionsWhere<T> })) ?? new entityConstructor({ id })

export const isAddress = (address?: string | null, ignoreChecksum?: boolean, ss58Format?: number): boolean => {
  try {
    return validateAddress(address, ignoreChecksum, ss58Format)
  } catch (error) {
    return false
  }
}

export const formatAddress = (address: string | Uint8Array, prefix = 42) => {
  if (typeof address === 'string') {
    if (isHex(address)) address = decodeHex(address)
    else address = ss58.decode(address).bytes
  }
  return ss58.codec(prefix).encode(address)
}

export const safeFormatAddress = (address: string) =>
  isEthereumAddress(address) ? address.toLowerCase() : formatAddress(address)

export const JsonScalar = new GraphQLScalarType({
  name: 'JSON',
  serialize: (value) => JSON.stringify(value),
  parseValue: (value) => {
    if (typeof value !== 'string') throw new Error('JsonScalar can only parse string values')
    return JSON.parse(value)
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) throw new Error('JsonScalar can only parse string values')
    return JSON.parse(ast.value)
  },
})

export const BigIntScalar = new GraphQLScalarType({
  name: 'BigInt',
  serialize: bigint.toJSON,
  parseValue: bigint.fromJSON,
  parseLiteral: bigint.fromJSON,
})

export const stringifyReplaceBigIntWithString = <K, V>(_: K, v: V) => (typeof v === 'bigint' ? v.toString() : v)

export const deepConvertBigIntToString = <T>(object: T): T =>
  JSON.parse(JSON.stringify(object, stringifyReplaceBigIntWithString))

export const deepParseAddresses = (object: unknown) => {
  // pluck all address looking things from the full extrinsic
  const stringified = JSON.stringify(object, stringifyReplaceBigIntWithString)
  const substrateMatches = [...(stringified.match(/0x[a-z0-9]{64}/gi) || [])]
  const evmMatches = [...(stringified.match(/0x[a-z0-9]{40}/gi) || [])]

  // filter out the addresses we don't care about
  const addresses = [...substrateMatches, ...evmMatches]
    .flatMap((addresses) => addresses)
    .filter(Boolean)
    .flatMap((address) => {
      try {
        // return substrate encoded address
        return safeFormatAddress(address)
      } catch (error) {
        // remove invaild addresses
        return []
      }
    })

  return [...new Set(addresses)]
}

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
