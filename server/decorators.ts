import { IncomingMessage, ServerResponse } from "http"
import { createParamDecorator } from "type-graphql"
import { AuthUser } from "./auth"

export type ContextType = {
  req: IncomingMessage
  res: ServerResponse
  user?: AuthUser | null
}

export function GqlContext() {
  return createParamDecorator<ContextType>(({ context }) => context)
}
