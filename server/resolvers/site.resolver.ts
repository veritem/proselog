import { type Context, GqlContext } from "$server/decorators"
import { getGuard } from "$server/guard"
import { prisma } from "$server/prisma"
import { checkSubdomain } from "$server/services/site.service"
import { ApolloError } from "apollo-server-core"
import { Args, Mutation, Query, Resolver } from "type-graphql"
import {
  CreateSiteArgs,
  DeleteSiteArgs,
  Site,
  UpdateSiteArgs,
} from "./site.types"

@Resolver((of) => Site)
export default class SiteResolver {
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
}
