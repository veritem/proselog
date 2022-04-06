import { ArgsType, Field, ObjectType } from "type-graphql"

@ObjectType()
export class Site {
  @Field()
  id: string

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
