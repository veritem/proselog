import { GqlContext, type ContextType } from "$server/decorators"
import { getGuard } from "$server/guard"
import { prisma } from "$server/prisma"
import { MembershipRole } from "@prisma/client"
import { ApolloError } from "apollo-server-core"
import { Args, FieldResolver, Mutation, Resolver, Root } from "type-graphql"
import {
  Membership,
  UpdateMembershipLastSwitchedToArgs,
} from "./membership.types"
import { Site } from "./site.types"

@Resolver((of) => Membership)
export default class MembershipResolver {
  @Mutation((returns) => Boolean)
  async updateMembershipLastSwitchedTo(
    @GqlContext() ctx: ContextType,
    @Args() args: UpdateMembershipLastSwitchedToArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    const memberships = await prisma.membership.findMany({
      where: {
        userId: guard.user.id,
        siteId: args.siteId,
        role: {
          in: [MembershipRole.OWNER, MembershipRole.ADMIN],
        },
      },
    })

    if (memberships.length === 0) {
      throw new ApolloError("You are not an admin of this site")
    }

    if (memberships.length > 1) {
      throw new ApolloError(
        "Unexpected multiple admin memberships for the same site",
      )
    }

    const membership = memberships[0]
    await prisma.membership.update({
      where: {
        id: membership.id,
      },
      data: {
        lastSwitchedTo: new Date(),
      },
    })

    return true
  }

  @FieldResolver((returns) => Site)
  async site(@GqlContext() ctx: ContextType, @Root() membership: Membership) {
    const guard = getGuard(ctx)

    const site = await prisma.site.findUnique({
      where: {
        id: membership.siteId,
      },
    })

    if (!site || site.deletedAt) {
      throw new ApolloError("Site not found")
    }

    guard.allow.ANY([() => guard.allow.site.read(site)])

    return site
  }
}
