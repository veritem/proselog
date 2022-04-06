import { Field, Int, ObjectType, Query, Resolver } from "type-graphql"
import { GqlContext } from "$server/decorators"
import type { Context } from "$server/decorators"
import { getGuard } from "$server/guard"

@ObjectType()
class Viewer {
  @Field((type) => Int)
  id: number

  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  image?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@Resolver((of) => Viewer)
export default class ViewerResolver {
  @Query((returns) => Viewer)
  async viewer(@GqlContext() ctx: Context) {
    const { user } = getGuard(ctx, { requireAuth: true })
    return user
  }
}
