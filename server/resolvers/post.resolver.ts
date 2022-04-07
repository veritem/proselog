import { Context, GqlContext } from "$server/decorators"
import { getGuard } from "$server/guard"
import { prisma } from "$server/prisma"
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
  CreatePostArgs,
  DeletePostArgs,
  Post,
  PostBySlugArgs,
  UpdatePostArgs,
} from "./post.types"
import { Site } from "./site.types"

@Resolver((of) => Post)
export default class PostResolver {
  @Query((returns) => Post)
  async postBySlug(@GqlContext() ctx: Context, @Args() args: PostBySlugArgs) {
    const guard = getGuard(ctx)

    const post = await prisma.post.findUnique({
      where: {
        slug: args.slug,
      },
    })

    if (!post) {
      throw new ApolloError(`post not found`)
    }

    guard.allow.ANY([() => guard.allow.post.read(post)])

    return post
  }

  @Mutation((returns) => Post)
  async createPost(@GqlContext() ctx: Context, @Args() args: CreatePostArgs) {
    const guard = getGuard(ctx, { requireAuth: true })

    const site = await prisma.site.findUnique({
      where: {
        id: args.siteId,
      },
    })

    if (!site) {
      throw new ApolloError("Site not found")
    }

    guard.allow.ANY([() => guard.allow.post.create(site)])

    const post = await prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        slug: nanoid(7),
        site: {
          connect: {
            id: args.siteId,
          },
        },
      },
    })

    return post
  }

  @Mutation((returns) => Post)
  async updatePost(@GqlContext() ctx: Context, @Args() args: UpdatePostArgs) {
    const guard = getGuard(ctx, { requireAuth: true })

    const post = await prisma.post.findUnique({
      where: {
        id: args.id,
      },
      include: {
        site: true,
      },
    })

    if (!post) {
      throw new ApolloError(`Post not found`)
    }

    guard.allow.ANY([() => guard.allow.post.update(post.site)])

    return prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: args.title,
        content: args.content,
      },
    })
  }

  @Mutation((returns) => Boolean)
  async deletePost(@GqlContext() ctx: Context, @Args() args: DeletePostArgs) {
    const guard = getGuard(ctx, { requireAuth: true })

    const post = await prisma.post.findUnique({
      where: {
        id: args.id,
      },
      include: {
        site: true,
      },
    })

    if (!post) {
      throw new ApolloError(`Post not found`)
    }

    guard.allow.ANY([() => guard.allow.post.delete(post.site)])

    await prisma.post.delete({
      where: {
        id: post.id,
      },
    })

    return true
  }

  @FieldResolver((returns) => Site)
  async site(@Root() post: Post) {
    const site = await prisma.site.findUnique({
      where: {
        id: post.siteId,
      },
    })

    return site
  }
}
