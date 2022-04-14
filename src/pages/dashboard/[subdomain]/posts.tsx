import { DashboardLayout } from "$src/components/app/DashboardLayout"
import { usePostsForDashboardQuery } from "$src/generated/graphql"
import Link from "next/link"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import clsx from "clsx"
import { useState } from "react"

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
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([])

  const toggleSelectedPostId = (id: string) => {
    setSelectedPostIds((ids) => {
      if (selectedPostIds.includes(id)) {
        return ids.filter((_id) => _id !== id)
      }
      return [...ids, id]
    })
  }

  return (
    <DashboardLayout>
      {posts && posts.nodes.length === 0 && (
        <div className="my-20 text-center text-3xl text-zinc-400">
          No Posts Yet.
        </div>
      )}
      {posts?.nodes.map((post) => {
        return (
          <Link
            key={post.id}
            href={`/dashboard/${subdomain}/edit-post/${post.id}`}
          >
            <a className="group hover:bg-zinc-50 border-b h-12 flex items-center">
              <span
                className={clsx(
                  `relative w-12 group-hover:visible h-12 flex items-center justify-center cursor-default`,
                  !selectedPostIds.includes(post.id) && `invisible`,
                )}
                onClick={(e) => {
                  e.preventDefault()
                  toggleSelectedPostId(post.id)
                }}
              >
                <input
                  type="checkbox"
                  tabIndex={-1}
                  checked={selectedPostIds.includes(post.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => {
                    toggleSelectedPostId(post.id)
                  }}
                />
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
