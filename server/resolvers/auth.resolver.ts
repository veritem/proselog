import { prisma } from "$server/prisma"
import { Args, Mutation, Resolver } from "type-graphql"
import dayjs from "dayjs"
import { RequestLoginLinkArgs } from "./auth.types"

@Resolver()
export default class AuthResolver {
  @Mutation((returns) => Boolean)
  async requestLoginLink(@Args() args: RequestLoginLinkArgs) {
    const token = await prisma.loginToken.create({
      data: {
        email: args.email,
        expiresAt: dayjs().add(10, "minute").toDate(),
      },
    })

    console.log(
      `Login link:`,
      `http://localhost:3000/api/login?token=${token.id}`,
    )

    return true
  }
}
