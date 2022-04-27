import { useRouter } from "next/router"
import { gql } from "graphql-tag"
import {
  UserSiteLayoutDocument,
  UserSiteLayoutQuery,
  UserSiteLayoutQueryVariables,
  useSiteIndexPageQuery,
} from "$src/generated/graphql"
import Link from "next/link"
import { formatDate } from "$src/lib/date"
import { UserSiteLayout } from "$src/components/app/UserSiteLayout"
import { serverSidePropsHandler } from "$src/lib/server-side-props"
import { createUrqlClient } from "$src/lib/urql-client"
import { getAuthTokenFromRequest } from "$server/auth"
import { IncomingMessage } from "http"
import { IS_PROD } from "$src/config"
import { getGraphqlEndpoint } from "$server/graphql-schema"

gql`
  query SiteIndexPage($domainOrSubdomain: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      posts: pages(visibility: PUBLISHED) {
        nodes {
          id
          title
          permalink
          publishedAt
          autoExcerpt
        }
      }
    }
  }
`

export const getServerSideProps = serverSidePropsHandler(async (ctx) => {
  const { client, ssr } = createUrqlClient({
    token: getAuthTokenFromRequest(ctx.req),
    endpoint: getGraphqlEndpoint(ctx.req),
  })

  const { error } = await client
    .query<UserSiteLayoutQuery, UserSiteLayoutQueryVariables>(
      UserSiteLayoutDocument,
      { domainOrSubdomain: ctx.query.domain as string },
    )
    .toPromise()

  if (error) {
    throw error
  }

  const urqlState = ssr.extractData()

  return {
    props: {
      urqlState,
    },
  }
})

export default function SiteIndexPage() {
  const router = useRouter()
  const domainOrSubdomain = router.query.domain as string

  const [siteResult] = useSiteIndexPageQuery({
    variables: {
      domainOrSubdomain,
    },
    pause: !domainOrSubdomain,
  })

  const site = siteResult.data?.site

  const posts = site?.posts.nodes

  return (
    <>
      <UserSiteLayout useHomeHeader>
        <div className="space-y-14">
          {posts?.map((post) => {
            return (
              <div key={post.id} className="block">
                <h3 className="text-2xl font-medium">
                  <Link href={post.permalink}>
                    <a className="hover:text-indigo-500">{post.title}</a>
                  </Link>
                </h3>
                <div className="text-sm text-zinc-400 mt-1">
                  {formatDate(post.publishedAt)}
                </div>
                <div className="mt-3 text-zinc-500">
                  {post.autoExcerpt}
                  {"..."}
                </div>
              </div>
            )
          })}
        </div>
      </UserSiteLayout>
    </>
  )
}
