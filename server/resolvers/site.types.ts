import { Args, ArgsType, Field, ObjectType } from "type-graphql"
import * as isoDate from "graphql-iso-date"
import { PaginationArgs } from "./shared.types"
import { PostVisibility } from "./post.types"

@ObjectType({ simpleResolvers: true })
export class Site {
  @Field()
  id: string

  @Field((type) => isoDate.GraphQLDateTime)
  createdAt: Date

  @Field((type) => isoDate.GraphQLDateTime)
  updatedAt: Date

  @Field()
  name: string

  @Field()
  subdomain: string

  @Field()
  userId: string

  @Field({ nullable: true })
  introduction?: string
}

@ArgsType()
export class CreateSiteArgs {
  @Field()
  name: string

  @Field()
  subdomain: string
}

@ArgsType()
export class UpdateSiteArgs {
  @Field()
  id: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  subdomain?: string

  @Field({ nullable: true })
  introduction?: string
}

@ArgsType()
export class DeleteSiteArgs {
  @Field()
  id: string
}

@ArgsType()
export class SitePostsArgs extends PaginationArgs {
  @Field((type) => PostVisibility, {
    defaultValue: PostVisibility.published,
  })
  visibility: PostVisibility
}

@ArgsType()
export class SiteArgs {
  @Field()
  domainOrSubdomain: string
}
