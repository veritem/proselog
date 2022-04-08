import {
  Args,
  FieldResolver,
  Query,
  Resolver,
  Root,
  Mutation,
} from "type-graphql"
import { GqlContext } from "$server/decorators"
import type { Context } from "$server/decorators"
import { getGuard } from "$server/guard"
import {
  GetSiteBySubdomainArgs,
  UpdateViewerProfileArgs,
  Viewer,
} from "./viewer.types"
import { prisma } from "$server/prisma"
import { Site } from "./site.types"

@Resolver((of) => Viewer)
export default class ViewerResolver {
  @Query((returns) => Viewer, { nullable: true })
  async viewer(@GqlContext() ctx: Context) {
    const { user } = getGuard(ctx, { requireAuth: true })
    return user
  }

  @FieldResolver((returns) => [Site])
  async sites(@Root() viewer: Viewer) {
    const sites = await prisma.site.findMany({
      where: {
        userId: viewer.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return sites
  }

  @FieldResolver((returns) => Site, { nullable: true })
  async siteBySubdomain(
    @GqlContext() ctx: Context,
    @Args() args: GetSiteBySubdomainArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    const site = await prisma.site.findUnique({
      where: {
        subdomain: args.subdomain,
      },
    })

    if (!site) {
      return
    }

    guard.allow.ANY([() => guard.allow.site.read(site)])

    return site
  }

  @Mutation((returns) => Viewer)
  async updateViewerProfile(
    @GqlContext() ctx: Context,
    @Args() args: UpdateViewerProfileArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    guard.allow.ANY([() => guard.allow.user.update({ userId: guard.user.id })])

    return prisma.user.update({
      where: {
        id: guard.user.id,
      },
      data: {
        name: args.name,
        avatar: args.avatar,
      },
    })
  }
}
