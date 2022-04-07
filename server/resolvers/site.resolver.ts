import { type Context, GqlContext } from "$server/decorators"
import { getGuard } from "$server/guard"
import { prisma } from "$server/prisma"
import { checkSubdomain } from "$server/services/site.service"
import { ApolloError } from "apollo-server-core"
import {
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql"
import { PostsConnection } from "./post.types"
import {
  CreateSiteArgs,
  DeleteSiteArgs,
  Site,
  SiteArgs,
  SitePostsArgs,
  UpdateSiteArgs,
} from "./site.types"

@Resolver((of) => Site)
export default class SiteResolver {
  @Query((returns) => Site)
  async site(@GqlContext() ctx: Context, @Args() args: SiteArgs) {
    const guard = getGuard(ctx)

    // Only cares about subdomain for now

    const site = await prisma.site.findUnique({
      where: {
        subdomain: args.domain,
      },
    })

    if (!site) {
      throw new ApolloError(`Site not found`)
    }

    guard.allow.ANY([() => guard.allow.site.read(site)])

    return site
  }

  @Mutation((returns) => Site)
  async createSite(@GqlContext() ctx: Context, @Args() args: CreateSiteArgs) {
    const guard = getGuard(ctx, { requireAuth: true })

    await checkSubdomain({
      subdomain: args.subdomain,
    })

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

  @Mutation((returns) => Site)
  async updateSite(@GqlContext() ctx: Context, @Args() args: UpdateSiteArgs) {
    const guard = getGuard(ctx, { requireAuth: true })

    const site = await prisma.site.findUnique({
      where: {
        id: args.id,
      },
    })

    if (!site) {
      throw new ApolloError(`Site not found`)
    }

    guard.allow.ANY([() => guard.allow.site.update(site)])

    if (args.subdomain) {
      await checkSubdomain({
        subdomain: args.subdomain,
        updatingSiteId: site.id,
      })
    }

    const updated = await prisma.site.update({
      where: {
        id: site.id,
      },
      data: {
        name: args.name,
        subdomain: args.subdomain,
      },
    })

    return updated
  }

  @Mutation((returns) => Boolean)
  async deleteSite(@GqlContext() ctx: Context, @Args() args: DeleteSiteArgs) {
    const guard = getGuard(ctx, { requireAuth: true })

    const site = await prisma.site.findUnique({
      where: {
        id: args.id,
      },
    })

    if (!site) {
      throw new ApolloError(`Site not found`)
    }

    guard.allow.ANY([() => guard.allow.site.delete(site)])

    await prisma.site.delete({
      where: {
        id: site.id,
      },
    })

    return true
  }

  @FieldResolver((returns) => PostsConnection)
  async posts(
    @GqlContext() ctx: Context,
    @Root() site: Site,
    @Args() args: SitePostsArgs,
  ): Promise<PostsConnection> {
    const guard = getGuard(ctx)

    guard.allow.ANY([
      () => guard.allow.post.list(args.drafts ? "all" : "public", site),
    ])

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          siteId: site.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: args.take + 1,
        cursor: {
          id: args.cursor,
        },
      }),
      await prisma.post.count({
        where: {
          siteId: site.id,
        },
      }),
    ])

    const hasMore = posts.length > args.take

    return {
      nodes: posts,
      pagination: {
        hasMore,
        total,
      },
    }
  }
}
