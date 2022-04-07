import { ArgsType, Field, ObjectType } from "type-graphql"
import * as isoDate from "graphql-iso-date"

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
