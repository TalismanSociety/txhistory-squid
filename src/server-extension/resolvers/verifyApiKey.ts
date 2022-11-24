import { Arg, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import bcrypt from 'bcrypt'

// the subsquid secret doesn't seem to be coming through here
// maybe it's only added to process.env for the processor?
// either way, hardcoding it for now
const apiKey = process.env.ADMIN_API_KEY
export const apiKeyHashed = typeof apiKey === 'string' && apiKey.length > 1 ? bcrypt.hashSync(apiKey, 10) : undefined
export const checkApiKey = (checkApiKey: string) => {
  if (typeof apiKeyHashed !== 'string') throw new Error('No ADMIN_API_KEY configured')
  return bcrypt.compare(checkApiKey, apiKeyHashed)
}

@Resolver()
export class VerifyApiKeyResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => Boolean)
  async verifyApiKey(@Arg('apiKey') apiKey: string): Promise<boolean> {
    if (!(await checkApiKey(apiKey))) return false
    return true
  }
}
