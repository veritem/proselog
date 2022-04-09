import { NextRequest, NextResponse } from "next/server"

export default (req: NextRequest) => {
  if (!req.cookies[process.env.AUTH_COOKIE_NAME]) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return url
  }
  return NextResponse.next()
}
