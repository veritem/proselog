import { type ContextType, GqlContext } from "$server/decorators"
import { getGuard } from "$server/guard"
import { prisma } from "$server/prisma"
import {
  checkSubdomain,
  getSiteByDomainOrSubdomain,
} from "$server/services/site.service"
import { MembershipRole, Prisma } from "@prisma/client"
import { ApolloError } from "apollo-server-core"
import { nanoid } from "nanoid"
import {
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql"
import { PostsConnection, PostVisibility } from "./post.types"
import {
  CreateSiteArgs,
  DeleteSiteArgs,
  Site,
  SiteArgs,
  SitePostsArgs,
  SiteStats,
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
        memberships: {
          create: {
            user: {
              connect: {
                id: guard.user.id,
              },
            },
            role: MembershipRole.OWNER,
            acceptedAt: new Date(),
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

    if (!site || site.deletedAt) {
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
        bio: args.bio,
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

    await prisma.site.update({
      where: {
        id: site.id,
      },
      data: {
        deletedAt: new Date(),
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

    const now = new Date()

    const where: Prisma.PostWhereInput = {
      siteId: site.id,
      deletedAt: null,
    }
    if (args.visibility === PostVisibility.published) {
      where.published = true
      where.publishedAt = {
        lte: now,
      }
    } else if (args.visibility === PostVisibility.scheduled) {
      where.published = true
      where.publishedAt = {
        gt: now,
      }
    } else if (args.visibility === PostVisibility.draft) {
      where.published = false
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

    guard.allow.EVERY(posts.map((post) => () => guard.allow.post.read(post)))

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
  async owner(@Root() site: Site) {
    const membership = await prisma.membership.findFirst({
      where: {
        role: MembershipRole.OWNER,
        siteId: site.id,
      },
      include: {
        user: true,
      },
    })

    if (!membership || membership.user.deletedAt) {
      return null
    }
    return membership.user
  }

  @FieldResolver((returns) => SiteStats)
  async stats(@Root() site: Site): Promise<SiteStats> {
    const postCount = await prisma.post.count({
      where: {
        deletedAt: null,
        siteId: site.id,
      },
    })

    const subscriberCount = await prisma.membership.count({
      where: {
        siteId: site.id,
        role: MembershipRole.SUBSCRIBER,
      },
    })

    return { id: nanoid(), postCount, subscriberCount }
  }
}
