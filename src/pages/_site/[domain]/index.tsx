import { useRouter } from "next/router"
import { gql } from "graphql-tag"
import { useSiteHomeDataQuery } from "$src/generated/graphql"
import Link from "next/link"
import { Button } from "$src/components/ui/Button"
import { Avatar } from "$src/components/ui/Avatar"
import { formatDate } from "$src/lib/date"
import Head from "next/head"
import { getUserContentsUrl } from "$src/lib/user-contents-helpers"

gql`
  query SiteHomeData($domainOrSubdomain: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      name
      bio
      subdomain
      owner {
        id
        name
        avatar
      }
      posts(visibility: published) {
        nodes {
          id
          title
          slug
          publishedAt
          content
        }
      }
    }
  }
`

export default function SiteIndexPage() {
  const router = useRouter()
  const domainOrSubdomain = router.query.domain as string

  const [siteHomeResult] = useSiteHomeDataQuery({
    variables: {
      domainOrSubdomain,
    },
    pause: !domainOrSubdomain,
  })

  const site = siteHomeResult.data?.site
  const avatars = [getUserContentsUrl(site?.owner.avatar)]

  const posts = site?.posts.nodes

  return (
    <>
      <Head>
        <title>{site?.name}</title>
      </Head>
      <div>
        <header className="py-14 bg-indigo-50 text-center">
          <div className="mb-5">
            <Avatar images={avatars} name={site?.name} />
          </div>
          <h1 className="text-2xl font-medium">
            <Link href={"/"}>
              <a>{site?.name}</a>
            </Link>
          </h1>
          {site?.bio && <div className="mt-2">{site?.bio}</div>}
          <div className="mt-8">
            <Button>Subscribe</Button>
          </div>
        </header>
        <div className="max-w-screen-md mx-auto px-5">
          <div className="my-10 space-y-5">
            {posts?.map((post) => {
              return (
                <Link href={`/${post.slug}`} key={post.id}>
                  <a className="block p-5 rounded-lg border">
                    <h3 className="text-2xl font-medium">{post.title}</h3>
                    <div className="text-sm text-zinc-500 mt-1">
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className="mt-3">
                      {post.content}
                      {"..."}
                    </div>
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
