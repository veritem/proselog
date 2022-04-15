import { prisma } from "$server/prisma"
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
  const sites = await prisma.site.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  if (sites.length === 0) return null

  return sites[0]
}

export const getSiteByDomainOrSubdomain = async (domainOrSubdomain: string) => {
  const site = await prisma.site.findUnique({
    where: {
      subdomain: domainOrSubdomain,
    },
  })

  if (!site) {
    throw new ApolloError(`Site not found`)
  }

  return site
}
