import { UserSiteLayout } from "$src/components/app/UserSiteLayout"
import { useSitePostPageDataQuery } from "$src/generated/graphql"
import { formatDate } from "$src/lib/date"
import { useRouter } from "next/router"
import { gql } from "urql"

gql`
  query SitePostPageData($domainOrSubdomain: String!, $slugOrId: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      name
    }
    post(slugOrId: $slugOrId) {
      id
      title
      publishedAt
      contentHTML
    }
  }
`

export default function SitePostPage() {
  const router = useRouter()
  const domainOrSubdomain = router.query.domain as string
  const slugOrId = router.query.post as string
  const [siteResult] = useSitePostPageDataQuery({
    variables: {
      domainOrSubdomain: domainOrSubdomain,
      slugOrId: slugOrId,
    },
    pause: !domainOrSubdomain || !slugOrId,
  })

  const post = siteResult.data?.post

  return (
    <UserSiteLayout title={post?.title}>
      <div className="text-center">
        <div className="text-zinc-500">{formatDate(post?.publishedAt)}</div>
        <h2 className="text-4xl font-bold mt-1">{post?.title}</h2>
      </div>
      <div
        className="mt-14 prose"
        dangerouslySetInnerHTML={{ __html: post?.contentHTML || "" }}
      ></div>
    </UserSiteLayout>
  )
}
