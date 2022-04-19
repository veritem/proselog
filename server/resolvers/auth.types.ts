import { ArgsType, Field } from "type-graphql"

@ArgsType()
export class RequestLoginLinkArgs {
  @Field()
  email: string

  @Field()
  next: string
}
