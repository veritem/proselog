import { ObjectType, Field, Int } from "type-graphql"
import * as isoDate from "graphql-iso-date"

@ObjectType()
export class Viewer {
  @Field((type) => Int)
  id: number

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
