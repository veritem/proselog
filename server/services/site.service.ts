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

  if (memberships.length === 0) return null

  return memberships[0].site
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
