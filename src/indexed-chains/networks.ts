import axios from 'axios'
import { networksUrl } from '../config'

export type Networks = Array<Partial<Network>>
export type Network = {
  name: string
  displayName: string
  tokens: string[]
  website: string
  description: string
  relayChain: string
  parachainId: string
  genesisHash: string
}

export async function fetchNetworks(): Promise<Networks> {
  const response = await axios.get(networksUrl)
  const responseOk = (status: number) => 200 <= status && status <= 299
  if (!responseOk(response.status))
    throw new Error(`Failed to fetch subsquid networks: ${response.status} ${response.statusText}`)

  return response.data?.networks as Networks
}
