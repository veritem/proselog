import { DashboardLayout } from "$src/components/app/DashboardLayout"
import { usePostsForDashboardQuery } from "$src/generated/graphql"
import Link from "next/link"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import clsx from "clsx"

export default function DashboardPostsPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [postsResult] = usePostsForDashboardQuery({
    variables: {
      domain: subdomain,
      includeDrafts: true,
    },
    pause: !subdomain,
  })

  const posts = postsResult.data?.site.posts

  return (
    <DashboardLayout>
      {posts?.nodes.map((post) => {
        return (
          <Link
            key={post.id}
            href={`/dashboard/${subdomain}/edit-post/${post.id}`}
          >
            <a className="group hover:bg-zinc-50 border-b h-12 flex items-center px-4">
              <span className="w-8 invisible group-hover:visible">
                <input type="checkbox" />
              </span>
              <span className="flex-shrink-0 flex">
                <span
                  className={clsx(
                    `post-status-circle`,
                    post.published ? `` : `is-draft`,
                  )}
                ></span>
              </span>
              <span className="w-full px-3">{post.title}</span>
              <span className="text-zinc-400 text-sm">
                {dayjs(post.publishedAt).format("YYYY/MM/DD")}
              </span>
            </a>
          </Link>
        )
      })}
    </DashboardLayout>
  )
}
