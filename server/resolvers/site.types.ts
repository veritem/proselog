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

  @Field((type) => String, { nullable: true })
  description?: string | null

  @Field((type) => String, { nullable: true })
  icon?: string | null
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
  description?: string

  @Field({ nullable: true })
  icon?: string
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
  @Field({ description: `Site id, subdomain or custom domain` })
  site: string
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

@ArgsType()
export class SubscribeToSiteArgs {
  @Field()
  siteId: string

  @Field({ nullable: true })
  email?: boolean

  @Field({ nullable: true })
  telegram?: boolean
}

@ObjectType({ simpleResolvers: true })
export class SiteSubscription {
  @Field()
  id: string

  @Field({ nullable: true })
  email?: boolean

  @Field({ nullable: true })
  telegram?: boolean
}

@ArgsType()
export class UnsubscribeToSiteArgs {
  @Field()
  site: string
}
