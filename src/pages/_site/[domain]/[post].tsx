import { UserSiteLayout } from "$src/components/app/UserSiteLayout"
import {
  SitePostPageDataDocument,
  SitePostPageDataQuery,
  SitePostPageDataQueryVariables,
  UserSiteLayoutDocument,
  UserSiteLayoutQuery,
  UserSiteLayoutQueryVariables,
  useSitePostPageDataQuery,
} from "$src/generated/graphql"
import { formatDate } from "$src/lib/date"
import { serverSidePropsHandler } from "$src/lib/server-side-props"
import { createUrqlClient } from "$src/lib/urql-client"
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

export const getServerSideProps = serverSidePropsHandler(async (ctx) => {
  const { client, ssr } = createUrqlClient()
  await Promise.all([
    client
      .query<SitePostPageDataQuery, SitePostPageDataQueryVariables>(
        SitePostPageDataDocument,
        {
          domainOrSubdomain: ctx.query.domain as string,
          slugOrId: ctx.query.post as string,
        },
      )
      .toPromise(),
    client
      .query<UserSiteLayoutQuery, UserSiteLayoutQueryVariables>(
        UserSiteLayoutDocument,
        { domainOrSubdomain: ctx.query.domain as string },
      )
      .toPromise(),
  ])
  const urqlState = ssr.extractData()
  return {
    props: { urqlState },
  }
})

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
        className="my-14 prose"
        dangerouslySetInnerHTML={{ __html: post?.contentHTML || "" }}
      ></div>
    </UserSiteLayout>
  )
}
