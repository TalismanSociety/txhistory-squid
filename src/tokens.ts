import { githubChainLogoUrl, githubTokenLogoUrl } from '@talismn/chaindata-provider'
export {
  githubChainsUrl,
  githubTestnetChainsUrl,
  githubEvmNetworksUrl,
  githubTokensUrl,
  githubChainLogoUrl,
  githubEvmNetworkLogoUrl,
  githubTokenLogoUrl,
  githubUnknownTokenLogoUrl,
} from '@talismn/chaindata-provider'

export const nativeTokens: Record<string, { logo?: string; symbol: string; decimals: number; coingeckoId?: string }> = {
  polkadot: { logo: githubChainLogoUrl('polkadot'), symbol: 'DOT', decimals: 10, coingeckoId: 'polkadot' },
  kusama: { logo: githubChainLogoUrl('kusama'), symbol: 'KSM', decimals: 12, coingeckoId: 'kusama' },
  acala: { logo: githubChainLogoUrl('acala'), symbol: 'ACA', decimals: 12, coingeckoId: 'acala' },
  astar: { logo: githubChainLogoUrl('astar'), symbol: 'ASTR', decimals: 18, coingeckoId: 'astar' },
  bifrost: {
    logo: githubChainLogoUrl('bifrost-kusama'),
    symbol: 'BNC',
    decimals: 12,
    coingeckoId: 'bifrost-native-coin',
  },
  calamari: { logo: githubChainLogoUrl('calamari'), symbol: 'KMA', decimals: 12, coingeckoId: 'calamari-network' },
  efinity: { logo: githubChainLogoUrl('efinity-polkadot'), symbol: 'EFI', decimals: 18, coingeckoId: 'efinity' },
  gmordie: { logo: githubTokenLogoUrl('gm-substrate-native-fren'), symbol: 'FREN', decimals: 12 },
  hydradx: { logo: githubChainLogoUrl('hydra'), symbol: 'HDX', decimals: 12 },
  interlay: { logo: githubChainLogoUrl('interlay'), symbol: 'INTR', decimals: 10 },
  karura: { logo: githubChainLogoUrl('karura'), symbol: 'KAR', decimals: 12, coingeckoId: 'karura' },
  rococo: { logo: githubChainLogoUrl('rococo-testnet'), symbol: 'ROC', decimals: 12 },
  moonbeam: { logo: githubChainLogoUrl('moonbeam'), symbol: 'GLMR', decimals: 18 },
  moonriver: { logo: githubChainLogoUrl('moonriver'), symbol: 'MOVR', decimals: 18 },
  statemint: { logo: githubChainLogoUrl('polkadot'), symbol: 'DOT', decimals: 10, coingeckoId: 'polkadot' },
  statemine: { logo: githubChainLogoUrl('kusama'), symbol: 'KSM', decimals: 12, coingeckoId: 'kusama' },
}

export const ormlTokens: Record<
  string,
  { chainId: string; onChainFormat: any; logo?: string; symbol: string; decimals: number; coingeckoId?: string }
> = {
  ausd: {
    chainId: 'acala',
    onChainFormat: { __kind: 'Token', value: { __kind: 'AUSD' } },
    logo: githubTokenLogoUrl('acala-substrate-orml-ausd'),
    symbol: 'aUSD',
    decimals: 12,
    coingeckoId: 'acala-dollar',
  },
  'karura-ausd': {
    chainId: 'karura',
    onChainFormat: { __kind: 'Token', value: { __kind: 'AUSD' } },
    logo: githubTokenLogoUrl('acala-substrate-orml-ausd'),
    symbol: 'aUSD',
    decimals: 12,
    coingeckoId: 'acala-dollar',
  },
  'karura-kusd-ausd': {
    chainId: 'karura',
    onChainFormat: { __kind: 'Token', value: { __kind: 'KUSD' } },
    logo: githubTokenLogoUrl('acala-substrate-orml-ausd'),
    symbol: 'aUSD',
    decimals: 12,
    coingeckoId: 'acala-dollar',
  },
  'bifrost-ausd': {
    chainId: 'bifrost',
    onChainFormat: { __kind: 'Stable', value: { __kind: 'KUSD' } },
    logo: githubTokenLogoUrl('acala-substrate-orml-ausd'),
    symbol: 'aUSD',
    decimals: 12,
    coingeckoId: 'acala-dollar',
  },

  lcdot: {
    chainId: 'acala',
    onChainFormat: { __kind: 'LiquidCrowdloan', value: 13 },
    logo: githubTokenLogoUrl('acala-substrate-lc-lcdot'),
    symbol: 'lcDOT',
    decimals: 10,
    coingeckoId: 'liquid-crowdloan-dot',
  },
  ldot: {
    chainId: 'acala',
    onChainFormat: { __kind: 'Token', value: { __kind: 'LDOT' } },
    logo: githubTokenLogoUrl('acala-substrate-orml-ldot'),
    symbol: 'LDOT',
    decimals: 10,
    coingeckoId: 'liquid-staking-dot',
  },
  'acala-dot': {
    chainId: 'acala',
    onChainFormat: { __kind: 'Token', value: { __kind: 'DOT' } },
    logo: githubChainLogoUrl('polkadot'),
    symbol: 'DOT',
    decimals: 10,
    coingeckoId: 'polkadot',
  },
  'karura-ksm': {
    chainId: 'karura',
    onChainFormat: { __kind: 'Token', value: { __kind: 'KSM' } },
    logo: githubChainLogoUrl('kusama'),
    symbol: 'KSM',
    decimals: 12,
    coingeckoId: 'kusama',
  },
  'bifrost-ksm': {
    chainId: 'bifrost',
    onChainFormat: { __kind: 'Token', value: { __kind: 'KSM' } },
    logo: githubChainLogoUrl('kusama'),
    symbol: 'KSM',
    decimals: 12,
    coingeckoId: 'kusama',
  },
  'bifrost-vksm': {
    chainId: 'bifrost',
    onChainFormat: { __kind: 'VToken', value: { __kind: 'KSM' } },
    logo: githubTokenLogoUrl('bifrost-substrate-vorml-vksm'),
    symbol: 'vKSM',
    decimals: 12,
  },
  'bifrost-vsksm': {
    chainId: 'bifrost',
    onChainFormat: { __kind: 'VSToken', value: { __kind: 'KSM' } },
    logo: githubTokenLogoUrl('bifrost-substrate-vsorml-vsksm'),
    symbol: 'vsKSM',
    decimals: 12,
  },
  'bifrost-vsdot': {
    chainId: 'bifrost',
    onChainFormat: { __kind: 'VSToken', value: { __kind: 'DOT' } },
    logo: githubTokenLogoUrl('bifrost-substrate-vsorml-vsdot'),
    symbol: 'vsDOT',
    decimals: 10,
  },
  'bifrost-rmrk': {
    chainId: 'bifrost',
    onChainFormat: { __kind: 'Token', value: { __kind: 'RMRK' } },
    logo: githubTokenLogoUrl('statemine-substrate-assets-rmrk'),
    symbol: 'RMRK',
    decimals: 10,
    coingeckoId: 'rmrk',
  },
  'karura-rmrk': {
    chainId: 'karura',
    onChainFormat: { __kind: 'ForeignAsset', value: 0 },
    logo: githubTokenLogoUrl('statemine-substrate-assets-rmrk'),
    symbol: 'RMRK',
    decimals: 10,
    coingeckoId: 'rmrk',
  },
  'karura-aris': {
    chainId: 'karura',
    onChainFormat: { __kind: 'ForeignAsset', value: 1 },
    logo: githubTokenLogoUrl('karura-substrate-foreignasset-aris'),
    symbol: 'ARIS',
    decimals: 18,
  },
  'bifrost-zlk': {
    chainId: 'bifrost',
    onChainFormat: { __kind: 'Token', value: { __kind: 'ZLK' } },
    logo: githubTokenLogoUrl('bifrost-substrate-orml-zlk'),
    symbol: 'ZLK',
    decimals: 18,
    coingeckoId: 'zenlink-network-token',
  },
  'bifrost-kar': {
    chainId: 'bifrost',
    onChainFormat: { __kind: 'Token', value: { __kind: 'KAR' } },
    logo: githubChainLogoUrl('karura'),
    symbol: 'KAR',
    decimals: 12,
    coingeckoId: 'karura',
  },
  'karura-tai': {
    chainId: 'karura',
    onChainFormat: { __kind: 'Token', value: { __kind: 'TAI' } },
    logo: githubChainLogoUrl('karura'),
    symbol: 'TAI',
    decimals: 12,
    coingeckoId: 'taiga',
  },
  gm: {
    chainId: 'gmordie',
    onChainFormat: { __kind: 'GM' },
    logo: githubTokenLogoUrl('gm-substrate-orml-gm'),
    symbol: 'GM',
    decimals: 0,
  },
  gn: {
    chainId: 'gmordie',
    onChainFormat: { __kind: 'GN' },
    logo: githubTokenLogoUrl('gm-substrate-orml-gn'),
    symbol: 'GN',
    decimals: 0,
  },
}

// TODO: Automatically download this list from the chains
// for example:
// https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fstatemine.api.onfinality.io%2Fpublic-ws#/assets
// the stateQuery is `assets.metadata(assetId)`
export const assetsTokens: Record<
  string,
  {
    chainId: string
    assetId: number
    logo?: string
    name: string
    symbol: string
    decimals: number
    coingeckoId?: string
  }
> = {
  chrawnna_coin: {
    chainId: 'statemine',
    assetId: 567,
    name: 'Chrawnna Coin',
    symbol: 'CHRWNA',
    decimals: 10,
  },
}
