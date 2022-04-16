import { prisma } from "$server/prisma"
import { MembershipRole } from "@prisma/client"
import { ApolloError } from "apollo-server-core"

export const checkSubdomain = async ({
  subdomain,
  updatingSiteId,
}: {
  subdomain: string
  updatingSiteId?: string
}) => {
  const existingSite = await prisma.site.findUnique({
    where: {
      subdomain,
    },
  })

  if (existingSite?.deletedAt) {
    // Actuall delete the site so that the subdomain can be used again
    await prisma.site.delete({
      where: {
        id: existingSite.id,
      },
    })
    return
  }

  if (existingSite && (!updatingSiteId || existingSite.id !== updatingSiteId)) {
    throw new Error(`Subdomain already taken`)
  }
}

export const getUserLastActiveSite = async (userId: string) => {
  const memberships = await prisma.membership.findMany({
    where: {
      userId,
      role: {
        in: [MembershipRole.OWNER, MembershipRole.ADMIN],
      },
    },
    include: {
      site: true,
    },
    orderBy: {
      lastSwitchedTo: "desc",
    },
  })

  const site = memberships[0]?.site

  if (!site || site.deletedAt) return null

  return site
}

export const getSiteByDomainOrSubdomain = async (domainOrSubdomain: string) => {
  const site = await prisma.site.findUnique({
    where: {
      subdomain: domainOrSubdomain,
    },
  })

  if (!site || site.deletedAt) {
    throw new ApolloError(`Site not found`)
  }

  return site
}
