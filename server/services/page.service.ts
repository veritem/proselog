import { prisma } from "$server/prisma"

export const checkPageSlug = async (
  pageId: string | null,
  slug: string | "" | false | undefined | null,
  siteId: string,
) => {
  if (!slug) {
    throw new Error("Missing page slug")
  }
  const page = await prisma.page.findFirst({
    where: {
      siteId,
      slug,
    },
  })
  if (!page) return
  if (page.id === pageId) return
  throw new Error("Page slug already used")
}
