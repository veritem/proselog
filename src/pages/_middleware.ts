import {
  AUTH_COOKIE_OPTIONS,
  IS_PROD,
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

  if (pathname === "/auth/complete") {
    const url = new URL(
      `${IS_PROD ? "https" : "http"}://${host}${pathname}${req.nextUrl.search}`,
    )
    const token = url.searchParams.get("token") as string
    const nextPath = url.searchParams.get("next_path") as string
    url.searchParams.delete("token")
    url.searchParams.delete("next_path")
    url.pathname = nextPath

    return NextResponse.redirect(url).cookie(
      process.env.AUTH_COOKIE_NAME,
      token,
      {
        ...AUTH_COOKIE_OPTIONS,
        domain: `.${url.hostname}`,
      },
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
