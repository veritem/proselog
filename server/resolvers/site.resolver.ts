import { type ContextType, GqlContext } from "$server/decorators"
import { getGuard } from "$server/guard"
import { prisma } from "$server/prisma"
import {
  checkSubdomain,
  getSiteByDomainOrSubdomain,
} from "$server/services/site.service"
import { Prisma } from "@prisma/client"
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
import { User } from "./user.types"

@Resolver((of) => Site)
export default class SiteResolver {
  @Query((returns) => Site)
  async site(@GqlContext() ctx: ContextType, @Args() args: SiteArgs) {
    const guard = getGuard(ctx)

    const site = await getSiteByDomainOrSubdomain(args.domainOrSubdomain)

    guard.allow.ANY([() => guard.allow.site.read(site)])

    return site
  }

  @Mutation((returns) => Site)
  async createSite(
    @GqlContext() ctx: ContextType,
    @Args() args: CreateSiteArgs,
  ) {
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
  async updateSite(
    @GqlContext() ctx: ContextType,
    @Args() args: UpdateSiteArgs,
  ) {
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
  async deleteSite(
    @GqlContext() ctx: ContextType,
    @Args() args: DeleteSiteArgs,
  ) {
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
    @GqlContext() ctx: ContextType,
    @Root() site: Site,
    @Args() args: SitePostsArgs,
  ): Promise<PostsConnection> {
    const guard = getGuard(ctx)

    guard.allow.ANY([
      () => guard.allow.post.list(args.includeDrafts ? "all" : "public", site),
    ])

    const now = new Date()

    const where: Prisma.PostWhereInput = {
      siteId: site.id,
    }
    if (args.includeDrafts) {
    } else {
      where.published = true
      where.publishedAt = {
        lte: now,
      }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: args.take + 1,
        cursor: args.cursor
          ? {
              id: args.cursor,
            }
          : undefined,
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

  @FieldResolver((returns) => User)
  user(@Root() site: Site) {
    return prisma.user.findUnique({
      where: {
        id: site.userId,
      },
    })
  }
}
