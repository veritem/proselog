import { ArgsType, Field } from "type-graphql"

@ArgsType()
export class UpdateMembershipLastSwitchedToArgs {
  @Field()
  siteId: string
}
