import { prisma } from "$server/prisma"
import { Args, Mutation, Resolver } from "type-graphql"
import dayjs from "dayjs"
import { RequestLoginLinkArgs } from "./auth.types"
import { ContextType, GqlContext } from "$server/decorators"
import { sendLoginEmail } from "$server/mailgun"

@Resolver()
export default class AuthResolver {
  @Mutation((returns) => Boolean)
  async requestLoginLink(
    @GqlContext() ctx: ContextType,
    @Args() args: RequestLoginLinkArgs,
  ) {
    const token = await prisma.loginToken.create({
      data: {
        email: args.email,
        expiresAt: dayjs().add(10, "minute").toDate(),
      },
    })

    const url = `http://localhost:3000/api/login?${new URLSearchParams([
      ["token", token.id],
      ["next", args.next],
    ]).toString()}`

    await sendLoginEmail(url, args.email)

    return true
  }
}
