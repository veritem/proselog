import { ContextType, GqlContext } from "$server/decorators"
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
import { validate as validateUUID } from "uuid"
import {
  CreatePostArgs,
  DeletePostArgs,
  Post,
  PostArgs,
  UpdatePostArgs,
} from "./post.types"
import { Site } from "./site.types"

@Resolver((of) => Post)
export default class PostResolver {
  @Query((returns) => Post)
  async post(@GqlContext() ctx: ContextType, @Args() args: PostArgs) {
    const guard = getGuard(ctx)

    const isUUID = validateUUID(args.slugOrId)
    const post = await prisma.post.findUnique({
      where: isUUID
        ? {
            id: args.slugOrId,
          }
        : { slug: args.slugOrId },
    })

    if (!post || post.deletedAt) {
      throw new ApolloError(`post not found`)
    }

    guard.allow.ANY([() => guard.allow.post.read(post)])

    return post
  }

  @Mutation((returns) => Post)
  async createPost(
    @GqlContext() ctx: ContextType,
    @Args() args: CreatePostArgs,
  ) {
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
  async updatePost(
    @GqlContext() ctx: ContextType,
    @Args() args: UpdatePostArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    const post = await prisma.post.findUnique({
      where: {
        id: args.id,
      },
      include: {
        site: true,
      },
    })

    if (!post || post.deletedAt) {
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
        published: args.published,
        publishedAt: args.publishedAt,
      },
    })
  }

  @Mutation((returns) => Boolean)
  async deletePost(
    @GqlContext() ctx: ContextType,
    @Args() args: DeletePostArgs,
  ) {
    const guard = getGuard(ctx, { requireAuth: true })

    const post = await prisma.post.findUnique({
      where: {
        id: args.id,
      },
      include: {
        site: true,
      },
    })

    if (!post || post.deletedAt) {
      throw new ApolloError(`Post not found`)
    }

    guard.allow.ANY([() => guard.allow.post.delete(post.site)])

    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        deletedAt: new Date(),
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
