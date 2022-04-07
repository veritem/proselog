import { ArgsType, Field, Int, ObjectType } from "type-graphql"

@ObjectType({ simpleResolvers: true })
export class Pagination {
  @Field()
  hasMore: boolean

  @Field((type) => Int)
  total: number
}

@ArgsType()
export class PaginationArgs {
  @Field((type) => Int, { defaultValue: 20 })
  take: number

  @Field({ nullable: true })
  cursor?: string
}
