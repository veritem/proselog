import { getAuthCookie } from "$src/lib/edge-function-helpers"
import { NextRequest, NextResponse } from "next/server"

export default (req: NextRequest) => {
  if (!getAuthCookie(req)) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return url
  }
  return NextResponse.next()
}
