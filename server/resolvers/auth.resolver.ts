import { prisma } from "$server/prisma"
import { Args, Mutation, Resolver } from "type-graphql"
import dayjs from "dayjs"
import { RequestLoginLinkArgs } from "./auth.types"
import { ContextType, GqlContext } from "$server/decorators"
import { sendLoginEmail } from "$server/mailgun"
import { IS_PROD, OUR_DOMAIN } from "$src/config"

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

    const url = `${
      IS_PROD ? "https" : "http"
    }://${OUR_DOMAIN}/api/login?${new URLSearchParams([
      ["token", token.id],
      ["next", args.next],
    ]).toString()}`

    await sendLoginEmail(url, args.email).catch(console.error)

    return true
  }
}
