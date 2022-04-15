import { Args, ArgsType, Field, ObjectType } from "type-graphql"
import * as isoDate from "graphql-iso-date"
import { PaginationArgs } from "./shared.types"

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
}

@ArgsType()
export class DeleteSiteArgs {
  @Field()
  id: string
}

@ArgsType()
export class SitePostsArgs extends PaginationArgs {
  @Field({ nullable: true })
  includeDrafts: boolean
}

@ArgsType()
export class SiteArgs {
  @Field()
  domainOrSubdomain: string
}
