import { decodeHex } from '@subsquid/util'

import { formatAddress } from './util'

const hex = '0xfc9fdcfb5f2fe429a593db45a236a78926561d3f9022609d8a0b53ec94b2a31e'
const hexDecoded = decodeHex(hex)
const genericSubstrate = '5HmwQvvkeApp4HBHE2PhURpa8K69CF8WPATZX3VTdPYePtuk'
const polkadot = '16iEZGBpVx6HVpBoBfShcaeiyw5ntYgeTfC3gLUpBUaAaa9m'
const kusama = 'JHZ5FGdGXqjovzizjCkNPBaGuNNzuwgqYJJuhmR7Bm997JC'

test('formatAddress encodes generic substrate addresses by default', () => {
  expect(formatAddress(hex)).toBe(genericSubstrate)
  expect(formatAddress(hexDecoded)).toBe(genericSubstrate)
  expect(formatAddress(genericSubstrate)).toBe(genericSubstrate)
  expect(formatAddress(polkadot)).toBe(genericSubstrate)
  expect(formatAddress(kusama)).toBe(genericSubstrate)
})

test('formatAddress encodes addresses with a specified prefix', () => {
  expect(formatAddress(hex, 0)).toBe(polkadot)
  expect(formatAddress(hexDecoded, 0)).toBe(polkadot)
  expect(formatAddress(genericSubstrate, 0)).toBe(polkadot)
  expect(formatAddress(polkadot, 0)).toBe(polkadot)
  expect(formatAddress(kusama, 0)).toBe(polkadot)

  expect(formatAddress(hex, 2)).toBe(kusama)
  expect(formatAddress(hexDecoded, 2)).toBe(kusama)
  expect(formatAddress(genericSubstrate, 2)).toBe(kusama)
  expect(formatAddress(polkadot, 2)).toBe(kusama)
  expect(formatAddress(kusama, 2)).toBe(kusama)
})

test('formatAddress throws a useful error for non-hex string inputs', () => {
  const nonAddress = 'this is a test this is only a test'
  const expectedError = new Error(`Invalid ss58 address: ${nonAddress}`)

  expect(() => formatAddress(nonAddress)).toThrowError(expectedError)
  expect(() => formatAddress(nonAddress, 0)).toThrowError(expectedError)
  expect(() => formatAddress(nonAddress, 2)).toThrowError(expectedError)
})
