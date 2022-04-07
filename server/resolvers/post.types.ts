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
