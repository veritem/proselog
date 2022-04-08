import { ArgsType, Field, ObjectType } from "type-graphql"
import * as isoDate from "graphql-iso-date"
import { Pagination, PaginationArgs } from "./shared.types"

@ArgsType()
export class CreatePostArgs {
  @Field()
  title: string

  @Field()
  content: string

  @Field()
  siteId: string
}

@ObjectType({ simpleResolvers: true })
export class Post {
  @Field()
  id: string

  @Field()
  title: string

  @Field()
  content: string

  @Field((type) => isoDate.GraphQLDateTime)
  createdAt: Date

  @Field((type) => isoDate.GraphQLDateTime)
  updatedAt: Date

  @Field((type) => isoDate.GraphQLDateTime)
  publishedAt: Date

  @Field()
  published: boolean

  @Field()
  siteId: string
}

@ObjectType({ simpleResolvers: true })
export class PostsConnection {
  @Field((type) => [Post])
  nodes: Post[]

  @Field((type) => Pagination)
  pagination: Pagination
}

@ArgsType()
export class PostBySlugArgs {
  @Field()
  slug: string
}

@ArgsType()
export class UpdatePostArgs {
  @Field()
  id: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  content?: string
}

@ArgsType()
export class DeletePostArgs {
  id: string
}
