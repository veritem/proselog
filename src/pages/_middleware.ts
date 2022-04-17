import { getAuthCookie } from "$src/lib/edge-function-helpers"
import { NextRequest, NextResponse } from "next/server"

export default (req: NextRequest) => {
  const host = req.headers.get("host")
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/uploads/")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // When logged in, redirect homepage to the dashboard
  if (req.nextUrl.pathname === "/" && getAuthCookie(req)) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.rewrite(url)
  }

  if (
    !host?.endsWith(process.env.OUR_DOMAIN) ||
    host.endsWith(`.${process.env.OUR_DOMAIN}`)
  ) {
    const domain = host?.replace(`.${process.env.OUR_DOMAIN}`, "")
    const url = req.nextUrl.clone()
    url.pathname = `/_site/${domain}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
