import { NextRequest, NextResponse } from "next/server"

export default (req: NextRequest) => {
  const host = req.headers.get("host")

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
