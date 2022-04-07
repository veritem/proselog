import { Site as DB_Site } from "@prisma/client"
import { ApolloError } from "apollo-server-core"
import { Context } from "./decorators"
import { AuthUser } from "./auth"

export const getGuard = <TRequireAuth extends boolean>(
  { user }: Context,
  { requireAuth }: { requireAuth?: TRequireAuth } = {},
) => {
  if (requireAuth && !user) {
    throw new ApolloError("login required")
  }

  const allow = {
    site: {
      get(site: Partial<DB_Site>) {
        return !!site.id
      },
      update(site: Partial<DB_Site>) {
        return user && site.userId === user.id
      },
      delete(site: Partial<DB_Site>) {
        return user && site.userId === user.id
      },
    },
    ANY(rules: (() => boolean | null | undefined)[]) {
      for (const rule of rules) {
        if (rule()) {
          return
        }
      }
      throw new ApolloError("permission denied")
    },
  }

  return {
    user: user as TRequireAuth extends true
      ? AuthUser
      : AuthUser | null | undefined,
    allow,
  }
}
