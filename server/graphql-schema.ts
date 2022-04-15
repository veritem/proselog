import { AuthChecker, buildSchema } from "type-graphql"
import { ContextType } from "./decorators"
import { singletonAsync } from "./singleton"

export const customAuthChecker: AuthChecker<ContextType> = (
  { root, args, context, info },
  roles,
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  const ok = roles.some((role) => {
    if (role === "CAN_VIEW_USER_PRIVATE_FIELDS") {
      return context.user && context.user.id === root.id
    }
    return false
  })

  return ok
}

export const schema = singletonAsync(
  "graphq-schema",
  async () => {
    const resolvers: any = []
    // @ts-expect-error
    const r = require.context("./resolvers", false, /\.resolver\.ts$/)

    for (const key of r.keys()) {
      const mod = await r(key)
      resolvers.push(mod.default)
    }

    const schema = await buildSchema({
      resolvers,
      authChecker: customAuthChecker,
    })

    return schema
  },
  // Always rebuild schema on each request in development
  process.env.NODE_ENV === "production",
)
