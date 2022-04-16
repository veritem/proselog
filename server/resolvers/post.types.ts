import { ArgsType, Field, ObjectType, registerEnumType } from "type-graphql"
import * as isoDate from "graphql-iso-date"
import { Pagination } from "./shared.types"

export enum PostVisibility {
  all = "all",
  published = "published",
  draft = "draft",
  scheduled = "scheduled",
}

registerEnumType(PostVisibility, {
  name: "PostVisibility",
})

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
  slug: string

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
export class PostArgs {
  @Field()
  slugOrId: string
}

@ArgsType()
export class UpdatePostArgs {
  @Field()
  id: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  content?: string

  @Field({ nullable: true })
  published?: boolean

  @Field((type) => isoDate.GraphQLDateTime, { nullable: true })
  publishedAt?: Date
}

@ArgsType()
export class DeletePostArgs {
  @Field()
  id: string
}
