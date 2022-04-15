import { ObjectType, Field, ArgsType, Authorized } from "type-graphql"
import * as isoDate from "graphql-iso-date"

@ObjectType()
export class User {
  @Field({ simple: true })
  id: string

  @Field({ simple: true })
  name: string

  @Field({ simple: true })
  username: string

  @Field({ nullable: true, simple: true })
  avatar?: string

  @Field((type) => isoDate.GraphQLDateTime, { simple: true })
  createdAt: Date

  @Field((type) => isoDate.GraphQLDateTime, { simple: true })
  updatedAt: Date

  @Authorized("CAN_VIEW_USER_PRIVATE_FIELDS")
  @Field()
  email: string

  @Authorized("CAN_VIEW_USER_PRIVATE_FIELDS")
  @Field({ nullable: true })
  emailVerified?: boolean
}

@ArgsType()
export class UpdateUserProfileArgs {
  @Field()
  userId: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  avatar?: string
}

@ArgsType()
export class UpdateUserEmailArgs {
  @Field()
  userId: string

  @Field()
  email: string
}

@ArgsType()
export class UserArgs {
  @Field()
  username: string
}
