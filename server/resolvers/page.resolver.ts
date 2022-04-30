import { ContextType, GqlContext } from "$server/decorators"
import { getGuard } from "$server/guard"
import { getExcerpt, renderPageContent } from "$server/markdown"
import { prisma } from "$server/prisma"
import { checkPageSlug } from "$server/services/page.service"
import { getSite } from "$server/services/site.service"
import { isUUID } from "$server/uuid"
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
import {
  DeletePageArgs,
  Page,
  PageArgs,
  CreateOrUpdatePageArgs,
} from "./page.types"
import { Site } from "./site.types"

@Resolver((of) => Page)
export default class PostResolver {
  @Query((returns) => Page)
  async page(@GqlContext() ctx: ContextType, @Args() args: PageArgs) {
    const guard = getGuard(ctx)

    const site = args.site ? await getSite(args.site) : null

    if (args.site && !site) {
      throw new ApolloError(`Site not found`)
    }

    const isPageUUID = isUUID(args.slugOrId)
    if (!isPageUUID && !args.site) {
      throw new ApolloError("missing args.site")
    }

    const page = isPageUUID
      ? await prisma.page.findUnique({
          where: {
            id: args.slugOrId,
          },
        })
      : site
      ? await prisma.page.findFirst({
          where: { siteId: site.id, slug: args.slugOrId },
        })
      : null

    if (!page || page.deletedAt) {
      throw new ApolloError(`page ${args.slugOrId} not found`)
    }

    guard.allow.ANY([() => guard.allow.page.read(page)])

    return page
  }

  @Mutation((returns) => Page)
  async createOrUpdatePage(
    @GqlContext() ctx: ContextType,
    @Args() args: CreateOrUpdatePageArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    const page = args.pageId
      ? await prisma.page.findUnique({
          where: {
            id: args.pageId,
          },
          include: {
            site: true,
          },
        })
      : await prisma.page.create({
          data: {
            title: "Untitled",
            slug: `untitled-${nanoid(4)}`,
            site: {
              connect: {
                id: args.siteId,
              },
            },
            content: "",
            excerpt: "",
          },
          include: {
            site: true,
          },
        })

    if (!page || page.deletedAt) {
      throw new ApolloError(`Page not found`)
    }

    guard.allow.ANY([() => guard.allow.page.update(page.site)])

    const slug = args.slug || page.slug
    await checkPageSlug(page.id, slug, page.site.id)

    return prisma.page.update({
      where: {
        id: page.id,
      },
      data: {
        title: args.title,
        content: args.content,
        published: args.published,
        publishedAt: args.publishedAt,
        excerpt: args.excerpt,
        slug,
        type: args.type,
      },
    })
  }

  @Mutation((returns) => Boolean)
  async deletePage(
    @GqlContext() ctx: ContextType,
    @Args() args: DeletePageArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    const page = await prisma.page.findUnique({
      where: {
        id: args.id,
      },
      include: {
        site: true,
      },
    })

    if (!page || page.deletedAt) {
      throw new ApolloError(`Post not found`)
    }

    guard.allow.ANY([() => guard.allow.page.delete(page.site)])

    await prisma.page.update({
      where: {
        id: page.id,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return true
  }

  @FieldResolver((returns) => Site)
  async site(@Root() page: Page) {
    const site = await prisma.site.findUnique({
      where: {
        id: page.siteId,
      },
    })

    return site
  }

  @FieldResolver((returns) => String)
  autoExcerpt(@Root() page: Page) {
    return page.excerpt || getExcerpt(page.content)
  }

  @FieldResolver((returns) => String)
  async contentHTML(@Root() page: Page) {
    const { html } = await renderPageContent(page.content)
    return html
  }

  @FieldResolver((returns) => String)
  permalink(@Root() page: Page) {
    return `/${page.slug}`
  }
}
