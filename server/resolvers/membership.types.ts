import { MembershipRole } from "@prisma/client"
import { ArgsType, Field, ObjectType } from "type-graphql"

@ArgsType()
export class UpdateMembershipLastSwitchedToArgs {
  @Field()
  siteId: string
}

@ObjectType({ simpleResolvers: true })
export class Membership {
  @Field()
  id: string

  @Field()
  siteId: string

  @Field()
  userId: string

  @Field((type) => String)
  role: MembershipRole
}
