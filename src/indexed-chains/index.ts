import { IndexedChain, IndexedChainInfo } from '../model'
import { defaultChainsConfig } from '../config'
import { Archive, fetchArchives } from './archives'
import { Network, fetchNetworks } from './networks'
import { getStandaloneDbConnection } from './db'

import { EntityManager } from 'typeorm'
import axios from 'axios'

export const getIndexedChain = async (id: string): Promise<IndexedChain | null> => {
  const entityManager = await getStandaloneDbConnection()
  return await entityManager.findOne(IndexedChain, { where: { id } })
}

export const getIndexedChains = async (
  { enabledOnly } = { enabledOnly: false }
): Promise<Record<string, IndexedChain>> => {
  const entityManager = await getStandaloneDbConnection()

  const query = enabledOnly ? { where: { enabled: true } } : undefined

  return Object.fromEntries(
    (await entityManager.find(IndexedChain, query)).map((indexedChain) => [indexedChain.id, indexedChain])
  )
}

export const updateIndexedChainsFromArchives = async (): Promise<void> => {
  const [archives, networks, entityManager] = await Promise.all([
    fetchArchives(),
    fetchNetworks(),
    getStandaloneDbConnection(),
  ])

  for (const archive of archives) {
    // get archive id
    const id = archive.network
    if (id === undefined) continue

    // create IndexedChain if it doesn't exist
    let indexedChain = await entityManager.findOne<IndexedChain>(IndexedChain, { where: { id } })
    if (!indexedChain) indexedChain = createNewChain(id)

    // update IndexedChain with the latest archive and network info
    const network =
      archive.genesisHash !== undefined
        ? networks.find((network) => network.genesisHash === archive.genesisHash)
        : undefined
    await updateChainInfoAndArchive(entityManager, indexedChain, archive, network)
  }
}

const createNewChain = (id: string): IndexedChain => {
  const defaultConfig = defaultChainsConfig[id]

  return new IndexedChain({
    id,

    // set later on by updateChainInfoAndArchive
    info: undefined,
    archive: undefined,

    // default values, can be overridden by defaultConfig
    enabled: false,
    startBlock: 0,
    ss58Format: 42,

    // default values, can be overridden by defaultConfig
    subscanUrl: `https://${id}.subscan.io`,
    calamarUrl: null,

    ...defaultConfig,
  })
}

const updateChainInfoAndArchive = async (
  entityManager: EntityManager,
  indexedChain: IndexedChain,
  archive: Partial<Archive>,
  network: Partial<Network> | undefined
): Promise<IndexedChain> => {
  const provider = (archive.providers || []).filter((provider) => provider.release === 'FireSquid')[0]

  indexedChain.info = network ? new IndexedChainInfo(network) : undefined
  indexedChain.archive = provider?.dataSourceUrl

  return await entityManager.save(indexedChain)
}

export const updateIndexedChainsCurrentAndHeadBlock = async () => {
  const entityManager = await getStandaloneDbConnection()

  const indexedChains = await entityManager.find(IndexedChain)
  await Promise.all(
    indexedChains.map(async ({ id, archive }) => {
      const idSanitised = id.replace(/[^a-z0-9-_]/gi, '')

      // get currentBlock from status table of chain schema in db
      const currentBlock =
        (await entityManager.connection
          .query(`select height from "${idSanitised}".status`)
          .then((result) => result[0].height)
          .catch((error) => console.warn(`Failed to fetch currentBlock for ${id}: ${error}`))) ?? undefined

      // get headBlock from archive node for chain
      const headBlock =
        typeof archive === 'string'
          ? await axios
              .post(archive, {
                query: '{ status { head } }',
              })
              .then((result) => result.data?.data?.status?.head)
              .catch((error) => console.warn(`Failed to fetch headBlock for ${id}: ${error}`))
          : undefined

      const updates: { currentBlock?: number; headBlock?: number } = {}
      if (currentBlock !== undefined) updates.currentBlock = currentBlock
      if (headBlock !== undefined) updates.headBlock = headBlock

      await entityManager.update(IndexedChain, { id }, updates)
    })
  )
}
