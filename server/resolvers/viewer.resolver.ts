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
  UpdateUserEmailArgs,
  UpdateUserProfileArgs,
  Viewer,
} from "./viewer.types"
import { prisma } from "$server/prisma"
import { Site } from "./site.types"
import { ApolloError } from "apollo-server-core"

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
    @Args() args: UpdateUserProfileArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    guard.allow.ANY([() => guard.allow.user.update({ userId: args.userId })])

    const user = await prisma.user.findUnique({
      where: {
        id: args.userId,
      },
    })

    if (!user) {
      throw new ApolloError("User not found")
    }

    return prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: args.name,
        avatar: args.avatar,
      },
    })
  }

  @Mutation((returns) => Viewer)
  async updateViewerEmail(
    @GqlContext() ctx: Context,
    @Args() args: UpdateUserEmailArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    guard.allow.ANY([() => guard.allow.user.update({ userId: args.userId })])

    const user = await prisma.user.findUnique({
      where: {
        id: args.userId,
      },
    })

    if (!user) {
      throw new ApolloError("User not found")
    }

    return prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: args.email,
        emailVerified: null,
      },
    })
  }
}
