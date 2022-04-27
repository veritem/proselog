import { UserSiteLayout } from "$src/components/app/UserSiteLayout"
import { useSiteArchivesPageQuery } from "$src/generated/graphql"
import { formatDate } from "$src/lib/date"
import gql from "graphql-tag"
import Link from "next/link"
import { useRouter } from "next/router"

gql`
  query SiteArchivesPage($domainOrSubdomain: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      posts: pages(visibility: PUBLISHED) {
        nodes {
          id
          title
          slug
          publishedAt
        }
      }
    }
  }
`

export default function SiteArchivesPage() {
  const router = useRouter()
  const domain = router.query.domain as string
  const [queryResult] = useSiteArchivesPageQuery({
    variables: {
      domainOrSubdomain: domain,
    },
    pause: !domain,
  })
  const posts = queryResult.data?.site.posts.nodes
  return (
    <UserSiteLayout title="Archives" useHomeHeader>
      <h2 className="text-xl font-bold page-title">Archives</h2>
      <div className="mt-5">
        {posts?.map((post) => {
          return (
            <div key={post.id} className="flex">
              <span className="text-zinc-400 mr-3">
                {formatDate(post.publishedAt)}
              </span>
              <Link href={`/${post.slug}`}>
                <a className="flex text-indigo-500 hover:underline">
                  {post.title}
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </UserSiteLayout>
  )
}
