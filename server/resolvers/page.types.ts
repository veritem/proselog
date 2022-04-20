import { ArgsType, Field, ObjectType, registerEnumType } from "type-graphql"
import * as isoDate from "graphql-iso-date"
import { Pagination } from "./shared.types"

export enum PageVisibilityEnum {
  ALL = "ALL",
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
}

registerEnumType(PageVisibilityEnum, {
  name: "PageVisibilityEnum",
})

export enum PageTypeEnum {
  PAGE = "PAGE",
  POST = "POST",
}

registerEnumType(PageTypeEnum, {
  name: "PageTypeEnum",
})

@ObjectType({ simpleResolvers: true })
export class Page {
  @Field()
  id: string

  @Field()
  slug: string

  @Field((type) => PageTypeEnum)
  type: PageTypeEnum

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

  @Field()
  excerpt: string
}

@ObjectType({ simpleResolvers: true })
export class PagesConnection {
  @Field((type) => [Page])
  nodes: Page[]

  @Field((type) => Pagination)
  pagination: Pagination
}

@ArgsType()
export class PageArgs {
  @Field()
  slugOrId: string

  @Field({ nullable: true, description: `Optional when slugOrId is an id` })
  domainOrSubdomain?: string
}

@ArgsType()
export class CreateOrUpdatePageArgs {
  @Field()
  siteId: string

  @Field({ nullable: true })
  pageId?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  content?: string

  @Field({ nullable: true })
  excerpt?: string

  @Field({ nullable: true })
  published?: boolean

  @Field((type) => isoDate.GraphQLDateTime, { nullable: true })
  publishedAt?: Date

  @Field({ nullable: true })
  slug?: string

  @Field((type) => PageTypeEnum, { nullable: true })
  type?: PageTypeEnum
}

@ArgsType()
export class DeletePageArgs {
  @Field()
  id: string
}
