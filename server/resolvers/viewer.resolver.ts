import { Query, Resolver } from "type-graphql"
import { GqlContext } from "$server/decorators"
import type { Context } from "$server/decorators"
import { getGuard } from "$server/guard"
import { Viewer } from "./viewer.types"

@Resolver((of) => Viewer)
export default class ViewerResolver {
  @Query((returns) => Viewer, { nullable: true })
  async viewer(@GqlContext() ctx: Context) {
    const { user } = getGuard(ctx)
    return user
  }
}
