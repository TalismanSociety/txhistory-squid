import { Arg, Field, ObjectType, Mutation, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { IndexedChain } from '../../model'
import { checkApiKey } from './verifyApiKey'

@ObjectType()
export class MutationResult {
  constructor(props?: Partial<MutationResult>) {
    Object.assign(this, props)
  }

  @Field(() => Boolean)
  success!: boolean

  @Field(() => String, { nullable: true })
  message?: string
}

@Resolver()
export class ChainResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Mutation(() => MutationResult)
  async updateChain(
    @Arg('apiKey') apiKey: string,
    @Arg('chainId') chainId: string,
    @Arg('enabled', { nullable: true }) enabled: boolean,
    @Arg('startBlock', { nullable: true }) startBlock: number,
    @Arg('ss58Format', { nullable: true }) ss58Format: number,
    @Arg('subscanUrl', { nullable: true }) subscanUrl: string,
    @Arg('calamarUrl', { nullable: true }) calamarUrl: string
  ): Promise<MutationResult> {
    if (!(await checkApiKey(apiKey))) return { success: false, message: 'AuthError' }

    const manager = await this.tx()

    const chain = await manager.findOne(IndexedChain, { where: { id: chainId } })
    if (!chain) return { success: false, message: `Chain with id '${chainId}' not found` }

    if (enabled !== undefined) chain.enabled = enabled
    if (startBlock !== undefined) chain.startBlock = startBlock
    if (ss58Format !== undefined) chain.ss58Format = ss58Format
    if (subscanUrl !== undefined) chain.subscanUrl = subscanUrl
    if (calamarUrl !== undefined) chain.calamarUrl = calamarUrl

    try {
      await manager.save(chain)
    } catch (error) {
      return { success: false, message: `Failed to save changes to chain with id '${chainId}': ${error}` }
    }

    return { success: true }
  }
}
