import { ObjectType, Field, Int, ArgsType } from "type-graphql"
import * as isoDate from "graphql-iso-date"

@ObjectType()
export class Viewer {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  emailVerified?: string

  @Field({ nullable: true })
  avatar?: string

  @Field((type) => isoDate.GraphQLDateTime)
  createdAt: Date

  @Field((type) => isoDate.GraphQLDateTime)
  updatedAt: Date
}

@ArgsType()
export class GetSiteBySubdomainArgs {
  @Field()
  subdomain: string
}

@ArgsType()
export class UpdateViewerProfileArgs {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  avatar?: string
}
