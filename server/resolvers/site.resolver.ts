import { type Context, GqlContext } from "$server/decorators"
import { getGuard } from "$server/guard"
import { prisma } from "$server/prisma"
import { Args, Mutation, Resolver } from "type-graphql"
import { CreateSiteArgs, Site } from "./site.types"

@Resolver((of) => Site)
export default class SiteResolver {
  @Mutation((returns) => Site)
  async createSite(@GqlContext() ctx: Context, @Args() args: CreateSiteArgs) {
    const guard = getGuard(ctx, { requireAuth: true })

    const site = await prisma.site.create({
      data: {
        name: args.name,
        subdomain: args.subdomain,
        user: {
          connect: {
            id: guard.user.id,
          },
        },
      },
    })

    return site
  }
}
