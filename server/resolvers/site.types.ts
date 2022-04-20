import { ArgsType, Field, Int, ObjectType } from "type-graphql"
import * as isoDate from "graphql-iso-date"
import { PaginationArgs } from "./shared.types"
import { PageTypeEnum, PageVisibilityEnum } from "./page.types"

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
  bio?: string
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
  bio?: string
}

@ArgsType()
export class DeleteSiteArgs {
  @Field()
  id: string
}

@ArgsType()
export class SitePagesArgs extends PaginationArgs {
  @Field((type) => PageVisibilityEnum, {
    defaultValue: PageVisibilityEnum.PUBLISHED,
  })
  visibility: PageVisibilityEnum

  @Field((type) => PageTypeEnum, {
    defaultValue: PageTypeEnum.POST,
  })
  type: PageTypeEnum
}

@ArgsType()
export class SiteArgs {
  @Field()
  domainOrSubdomain: string
}

// TODO: maybe some fields should only allow admin to view
@ObjectType({ simpleResolvers: true })
export class SiteStats {
  @Field()
  id: string

  @Field((type) => Int)
  postCount: number

  @Field((type) => Int)
  subscriberCount: number
}
