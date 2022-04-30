import { type ContextType, GqlContext } from "$server/decorators"
import { getGuard } from "$server/guard"
import { prisma } from "$server/prisma"
import {
  checkSubdomain,
  getMembership,
  getSite,
} from "$server/services/site.service"
import { MembershipRole, PageType, Prisma } from "@prisma/client"
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
import { Page, PagesConnection, PageVisibilityEnum } from "./page.types"
import {
  CreateSiteArgs,
  DeleteSiteArgs,
  Site,
  SiteArgs,
  SitePagesArgs,
  SiteStats,
  SiteSubscription,
  SubscribeToSiteArgs,
  UnsubscribeToSiteArgs,
  UpdateSiteArgs,
} from "./site.types"
import { User } from "./user.types"

@Resolver((of) => Site)
export default class SiteResolver {
  @Query((returns) => Site)
  async site(@GqlContext() ctx: ContextType, @Args() args: SiteArgs) {
    const guard = getGuard(ctx)

    const site = await getSite(args.site)

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
        pages: {
          create: {
            title: "About",
            slug: "about",
            excerpt: "",
            content: `My name is ${args.name} and I'm a new site.`,
            type: PageType.PAGE,
            published: true,
            publishedAt: new Date(),
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
        description: args.description,
        icon: args.icon,
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

  @Mutation((returns) => Site)
  async subscribeToSite(
    @GqlContext() ctx: ContextType,
    @Args() args: SubscribeToSiteArgs,
  ): Promise<Site> {
    const guard = getGuard(ctx, { requireAuth: true })
    const site = await getSite(args.siteId)

    let membership = await getMembership({
      userId: guard.user.id,
      siteId: site.id,
      role: MembershipRole.SUBSCRIBER,
    })

    if (membership) {
      const config = membership.config as Record<string, any>
      await prisma.membership.update({
        where: {
          id: membership.id,
        },
        data: {
          config: {
            email: args.email ?? config.email,
            telegram: args.telegram ?? config.telegram,
          },
        },
      })
    } else {
      membership = await prisma.membership.create({
        data: {
          role: MembershipRole.SUBSCRIBER,
          config: {
            email: args.email,
            telegram: args.telegram,
          },
          user: {
            connect: {
              id: guard.user.id,
            },
          },
          site: {
            connect: {
              id: site.id,
            },
          },
        },
      })
    }

    return site
  }

  @Mutation((returns) => Boolean)
  async unsubscribeToSite(
    @GqlContext() ctx: ContextType,
    @Args() args: UnsubscribeToSiteArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    const site = await getSite(args.site)

    const membership = await getMembership({
      userId: guard.user.id,
      siteId: site.id,
      role: MembershipRole.SUBSCRIBER,
    })

    if (!membership) {
      throw new ApolloError(`User is not subscribed to this site`)
    }

    await prisma.membership.delete({
      where: {
        id: membership.id,
      },
    })

    return true
  }

  @FieldResolver((returns) => PagesConnection)
  async pages(
    @GqlContext() ctx: ContextType,
    @Root() site: Site,
    @Args() args: SitePagesArgs,
  ): Promise<PagesConnection> {
    const guard = getGuard(ctx)

    const now = new Date()

    const where: Prisma.PageWhereInput = {
      siteId: site.id,
      deletedAt: null,
      type: args.type,
    }
    if (args.visibility === PageVisibilityEnum.PUBLISHED) {
      where.published = true
      where.publishedAt = {
        lte: now,
      }
    } else if (args.visibility === PageVisibilityEnum.SCHEDULED) {
      where.published = true
      where.publishedAt = {
        gt: now,
      }
    } else if (args.visibility === PageVisibilityEnum.DRAFT) {
      where.published = false
    }

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
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
      await prisma.page.count({
        where: {
          siteId: site.id,
        },
      }),
    ])

    guard.allow.EVERY(pages.map((page) => () => guard.allow.page.read(page)))

    const hasMore = pages.length > args.take

    return {
      nodes: pages as Page[],
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
    const postCount = await prisma.page.count({
      where: {
        deletedAt: null,
        siteId: site.id,
        type: PageType.POST,
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

  @FieldResolver((returns) => SiteSubscription, { nullable: true })
  async subscription(
    @GqlContext() ctx: ContextType,
    @Root() site: Site,
  ): Promise<SiteSubscription | null> {
    const guard = getGuard(ctx)
    if (!guard.user) return null
    const membership = await getMembership({
      userId: guard.user.id,
      siteId: site.id,
      role: MembershipRole.SUBSCRIBER,
    })
    if (!membership) return null

    const config = membership.config as Record<string, any>
    return {
      id: membership.id,
      email: config.email,
      telegram: config.telegram,
    }
  }
}
