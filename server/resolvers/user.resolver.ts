import {
  Args,
  Query,
  Resolver,
  Mutation,
  FieldResolver,
  Root,
} from "type-graphql"
import { GqlContext } from "$server/decorators"
import type { ContextType } from "$server/decorators"
import { getGuard } from "$server/guard"
import {
  UpdateUserEmailArgs,
  UpdateUserProfileArgs,
  User,
  UserArgs,
} from "./user.types"
import { prisma } from "$server/prisma"
import { ApolloError } from "apollo-server-core"
import { Site, SiteArgs } from "./site.types"
import { getSiteByDomainOrSubdomain } from "$server/services/site.service"

@Resolver((of) => User)
export default class UserResolver {
  @Query((returns) => User, { nullable: true })
  async viewer(@GqlContext() ctx: ContextType) {
    const { user } = getGuard(ctx)
    return user
  }

  @Query((returns) => User, { nullable: true })
  async user(@Args() args: UserArgs) {
    const user = await prisma.user.findUnique({
      where: {
        username: args.username,
      },
    })

    if (!user) {
      return null
    }

    return user
  }

  @Mutation((returns) => User)
  async updateUserProfile(
    @GqlContext() ctx: ContextType,
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

    if (args.email) {
      const userByEmail = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      })
      if (userByEmail && userByEmail.id !== user.id) {
        throw new ApolloError("Email already in use")
      }
    }

    if (args.username) {
      const userByUsername = await prisma.user.findUnique({
        where: {
          username: args.username,
        },
      })
      if (userByUsername && userByUsername.id !== user.id) {
        throw new ApolloError("Username already in use")
      }
    }

    return prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: args.name,
        avatar: args.avatar,
        username: args.username,
        email: args.email,
        emailVerified: args.email !== user.email ? null : undefined,
      },
    })
  }

  @FieldResolver((returns) => [Site])
  async sites(@GqlContext() ctx: ContextType, @Root() user: User) {
    const guard = getGuard(ctx)

    guard.allow.ANY([() => guard.allow.site.list()])

    const sites = await prisma.site.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return sites
  }

  @FieldResolver((returns) => Site)
  async site(@GqlContext() ctx: ContextType, @Args() args: SiteArgs) {
    const guard = getGuard(ctx)

    const site = await getSiteByDomainOrSubdomain(args.domainOrSubdomain)

    guard.allow.ANY([() => guard.allow.site.read(site)])

    return site
  }
}
