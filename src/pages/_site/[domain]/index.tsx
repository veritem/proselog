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

gql`
  query SiteIndexPage($domainOrSubdomain: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      posts(visibility: published) {
        nodes {
          id
          title
          slug
          publishedAt
          autoExcerpt
        }
      }
    }
  }
`

export const getServerSideProps = serverSidePropsHandler(async (ctx) => {
  const { client, ssr } = createUrqlClient()

  await client
    .query<UserSiteLayoutQuery, UserSiteLayoutQueryVariables>(
      UserSiteLayoutDocument,
      { domainOrSubdomain: ctx.query.domain as string },
    )
    .toPromise()

  return {
    props: {
      urqlState: ssr.extractData(),
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
      <UserSiteLayout>
        <div className="my-20 space-y-20">
          {posts?.map((post) => {
            return (
              <div key={post.id} className="block">
                <div className="text-sm text-zinc-400 mb-1">
                  {formatDate(post.publishedAt)}
                </div>
                <h3 className="text-2xl font-medium">
                  <Link href={`/${post.slug}`}>
                    <a className="hover:text-indigo-500">{post.title}</a>
                  </Link>
                </h3>
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
