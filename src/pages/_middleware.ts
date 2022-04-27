import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  IS_PROD,
  OUR_DOMAIN,
  S3_BUCKET_NAME,
  S3_ENDPOINT,
} from "$src/config"
import { NextRequest, NextResponse } from "next/server"

export default async (req: NextRequest) => {
  const host = req.headers.get("host")
  const { pathname } = req.nextUrl

  if (pathname === "/favicon.ico") {
    return new Response("not found", { status: 404 })
  }

  if (pathname === "/login") {
    return NextResponse.next()
  }

  if (pathname === "/logout") {
    const next = req.nextUrl.searchParams.get("next")
    const url = next ? new URL(next) : req.nextUrl.clone()
    if (!next) {
      url.pathname = "/"
    }
    return NextResponse.redirect(url).clearCookie(
      AUTH_COOKIE_NAME,
      getAuthCookieOptions({ clearCookie: true }),
    )
  }

  if (!IS_PROD && pathname.startsWith("/dev-s3-proxy/")) {
    return NextResponse.rewrite(
      `https://${S3_BUCKET_NAME}.${S3_ENDPOINT}${pathname.replace(
        "/dev-s3-proxy/",
        "/",
      )}`,
    )
  }

  if (pathname.startsWith("/uploads/")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  if (!host?.endsWith(OUR_DOMAIN) || host.endsWith(`.${OUR_DOMAIN}`)) {
    const domain = host?.replace(`.${OUR_DOMAIN}`, "")
    const url = req.nextUrl.clone()
    url.pathname = `/_site/${domain}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
