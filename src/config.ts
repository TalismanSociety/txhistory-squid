import type { IndexedChain } from './model'

export const githubUrl = 'https://raw.githubusercontent.com/subsquid/archive-registry/main'
export const archivesUrl = `${githubUrl}/archives.json`
export const networksUrl = `${githubUrl}/networks.json`

/**
 * Default values for the chains which we're interested in.
 *
 * When a new chain is found in the subsquid archives, this list is
 * referenced in order to override any default settings for that chain.
 *
 * When a field in this list is `undefined`, the default value will be used instead.
 *
 * To find the data we need:
 * - https://app.gc.subsquid.io/beta/chaindata/v3/graphql
 * - https://github.com/TalismanSociety/chaindata/blob/main/chaindata.json
 */
export const defaultChainsConfig: Record<string, Partial<Omit<IndexedChain, 'id' | 'info'>>> = {
  polkadot: {
    enabled: true,
    ss58Format: 0,
    startBlock: 11_000_000,
  },
  kusama: {
    enabled: true,
    ss58Format: 2,
    startBlock: 13_000_000,
  },
  acala: { enabled: true, ss58Format: 10 },
  astar: { enabled: true, ss58Format: 5 },
  bifrost: {
    enabled: true,
    ss58Format: 6,
    subscanUrl: `https://bifrost-kusama.subscan.io`,
  },
  calamari: { enabled: true, ss58Format: 78 },
  efinity: { enabled: true, ss58Format: 1110 },
  equilibrium: { enabled: false, ss58Format: 68 }, // Unknown field "stateRoot" on type "BlockHeader"
  gmordie: {
    enabled: true,
    ss58Format: 7013,
    subscanUrl: null,
    calamarUrl: 'https://calamar.app/gmordie',
  },
  hydradx: { enabled: true, ss58Format: 63 },
  interlay: { enabled: true, ss58Format: 2032 },
  karura: { enabled: true, ss58Format: 8 },
  moonbeam: { enabled: true, ss58Format: -1 },
  moonriver: { enabled: true, ss58Format: -1 },
  rococo: { enabled: true, ss58Format: 42 },
  statemine: { enabled: true, ss58Format: 2 },
  statemint: { enabled: true, ss58Format: 0 },
}
