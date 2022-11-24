import { Int, Field, ObjectType, ClassType } from 'type-graphql'

@ObjectType({ isAbstract: true })
export class ParsedTxBase {
  /** source: event */
  @Field()
  chainId!: string

  /** source: extrinsic */
  @Field({ nullable: true })
  fee?: string

  /** source: extrinsic */
  @Field({ nullable: true })
  tip?: string

  /** source: extrinsic */
  @Field()
  success!: boolean
}

export function withToken<TBaseClass extends ClassType>(BaseClass: TBaseClass) {
  @ObjectType({ isAbstract: true })
  class TokenTrait extends BaseClass {
    /** source: tba (hardcoded for now) */
    @Field()
    tokenLogo!: string

    /** source: tba (hardcoded for now) */
    @Field()
    tokenSymbol!: string

    /** source: tba (hardcoded for now) */
    @Field(() => Int)
    tokenDecimals!: number
  }
  return TokenTrait
}
