import { NextRequest } from "next/server"

export const getAuthCookie = (req: NextRequest) => {
  return req.cookies[process.env.AUTH_COOKIE_NAME]
}
