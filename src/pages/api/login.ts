import { setAuthCookie } from "$server/auth"
import { prisma } from "$server/prisma"
import { nanoid } from "nanoid"
import { NextApiHandler } from "next"
import { UAParser } from "ua-parser-js"

const handler: NextApiHandler = async (req, res) => {
  const token = req.query.token as string | undefined
  if (!token) return res.send("no token provided")

  const next = req.query.next as string | undefined
  if (!next) return res.send("no next provided")

  const userAgentString = req.headers["user-agent"] as string | undefined

  if (!userAgentString) {
    return res.status(401).send("no user agent provided")
  }

  const loginToken = await prisma.loginToken.findUnique({
    where: {
      id: token,
    },
  })

  if (!loginToken) {
    return res.send(`invalid token`)
  }

  if (loginToken.expiresAt < new Date()) {
    return res.send(`token expired`)
  }

  let user = await prisma.user.findUnique({
    where: {
      email: loginToken.email,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: loginToken.email,
        name: loginToken.email.split("@")[0],
        username: nanoid(7),
      },
    })
  }

  await prisma.loginToken.delete({
    where: {
      id: loginToken.id,
    },
  })

  const ua = new UAParser(userAgentString)

  const accessToken = await prisma.accessToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      token: nanoid(32),
      name: `Login via ${ua.getOS().name} ${ua.getBrowser().name}`,
    },
  })

  if (process.env.NODE_ENV === "development") {
    console.log("login with token", accessToken.token)
  }
  setAuthCookie(res, accessToken.token)

  const nextUrl = new URL(next)

  if (
    nextUrl.host !== process.env.OUR_DOMAIN &&
    nextUrl.hostname.endsWith(`.${process.env.OUR_DOMAIN}`)
  ) {
    // Check if the host belong to a site
    const existing = await prisma.domain.findUnique({
      where: {
        domain: nextUrl.hostname,
      },
    })
    if (!existing) {
      res.send(`invalid next url`)
      return
    }
  }

  nextUrl.searchParams.set("token", accessToken.token)
  nextUrl.searchParams.set("next_path", nextUrl.pathname)
  nextUrl.pathname = "/auth/complete"
  console.log("redirecting to", nextUrl.href)
  res.redirect(nextUrl.href)
}

export default handler
