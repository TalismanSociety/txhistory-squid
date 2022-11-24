import axios from 'axios'
import { archivesUrl } from '../config'

export type Archives = Array<Partial<Archive>>
export type Archive = {
  network: string
  genesisHash: string
  providers: Array<Partial<ArchiveProvider>>
}
export type ArchiveProvider = {
  provider: string
  dataSourceUrl: string
  explorerUrl: string
  release: string
  image: string
  ingest: string
  gateway: string
}

export async function fetchArchives(): Promise<Archives> {
  const response = await axios.get(archivesUrl)
  const responseOk = (status: number) => 200 <= status && status <= 299
  if (!responseOk(response.status))
    throw new Error(`Failed to fetch subsquid archives: ${response.status} ${response.statusText}`)

  return response.data?.archives as Archives
}
