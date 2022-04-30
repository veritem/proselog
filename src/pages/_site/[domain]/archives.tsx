import { SiteLayout } from "$src/components/site/SiteLayout"
import { useSiteArchivesPageQuery } from "$src/generated/graphql"
import { formatDate } from "$src/lib/date"
import gql from "graphql-tag"
import Link from "next/link"
import { useRouter } from "next/router"

gql`
  query SiteArchivesPage($site: String!) {
    site(site: $site) {
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
  const domainOrSubdomain = router.query.domain as string
  const [queryResult] = useSiteArchivesPageQuery({
    variables: {
      site: domainOrSubdomain,
    },
    pause: !domainOrSubdomain,
  })
  const posts = queryResult.data?.site.posts.nodes
  return (
    <SiteLayout title="Archives">
      <h2 className="text-xl font-bold page-title">Archives</h2>
      <div className="mt-5">
        {posts?.map((post) => {
          return (
            <div key={post.id} className="flex">
              <span className="text-zinc-400 mr-3">
                {formatDate(post.publishedAt)}
              </span>
              <Link href={`/${post.slug}`}>
                <a className="flex text-accent hover:underline">{post.title}</a>
              </Link>
            </div>
          )
        })}
      </div>
    </SiteLayout>
  )
}
