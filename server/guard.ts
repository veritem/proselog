import { ApolloError } from "apollo-server-core"
import { Context } from "./decorators"
import { AuthUser } from "./auth"

export const getGuard = <TRequireAuth extends boolean>(
  ctx: Context,
  { requireAuth }: { requireAuth?: TRequireAuth } = {},
) => {
  if (requireAuth && !ctx.user) {
    throw new ApolloError("login required")
  }

  return {
    user: ctx.user as TRequireAuth extends true
      ? AuthUser
      : AuthUser | null | undefined,
  }
}
