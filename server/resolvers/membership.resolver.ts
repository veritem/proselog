import { GqlContext, type ContextType } from "$server/decorators"
import { getGuard } from "$server/guard"
import { prisma } from "$server/prisma"
import { MembershipRole } from "@prisma/client"
import { ApolloError } from "apollo-server-core"
import { Args, Mutation, Resolver } from "type-graphql"
import { UpdateMembershipLastSwitchedToArgs } from "./membership.types"

@Resolver()
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
}
