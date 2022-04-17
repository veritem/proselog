import dayjs from "dayjs"
import { PostVisibility } from "$src/generated/graphql"
import { useMemo } from "react"

export const usePostVisibility = ({
  published,
  publishedAt,
}: {
  published: boolean
  publishedAt: string | Date | null
}) => {
  const visibility = useMemo<Omit<PostVisibility, PostVisibility.All>>(() => {
    return getPostVisibility({ published, publishedAt })
  }, [published, publishedAt])

  return visibility
}

export const getPostVisibility = ({
  published,
  publishedAt,
}: {
  published: boolean
  publishedAt: string | Date | null
}) => {
  if (!published) {
    return PostVisibility.Draft
  }
  if (published && publishedAt && dayjs(publishedAt).isBefore(new Date())) {
    return PostVisibility.Published
  }
  return PostVisibility.Scheduled
}
