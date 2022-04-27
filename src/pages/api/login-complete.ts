import { setAuthCookie } from "$server/auth"
import { prisma } from "$server/prisma"
import { IS_PROD, OUR_DOMAIN } from "$src/config"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const id = req.query.id as string | undefined
  const path = req.query.path as string | undefined
  if (!id) {
    return res.status(400).send("no id provided")
  }
  const host = req.headers.host as string | undefined
  const isCustomDomain = host && !host.endsWith(`.${OUR_DOMAIN}`)

  // Set cookie again for custom domain and subdomain.localhost (because *.localhost in cookie domain doesn't work)
  if (host && (isCustomDomain || !IS_PROD)) {
    const accessToken = await prisma.accessToken.findUnique({
      where: {
        publicId: id,
      },
    })

    if (
      !accessToken ||
      !accessToken.publicIdExpiresAt ||
      accessToken.publicIdExpiresAt < new Date()
    ) {
      return res.status(400).send("invalid id or id expired")
    }

    setAuthCookie(res, host, accessToken.token)

    await prisma.accessToken.update({
      where: {
        id: accessToken.id,
      },
      data: {
        publicId: null,
        publicIdExpiresAt: null,
      },
    })
  }

  res.redirect(`${path || "/"}`)
}

export default handler
