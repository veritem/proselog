import { DashboardLayout } from "$src/components/app/DashboardLayout"
import {
  useDeletePostMutation,
  usePostsForDashboardQuery,
  PostVisibility,
} from "$src/generated/graphql"
import Link from "next/link"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import clsx from "clsx"
import { useState } from "react"
import toast from "react-hot-toast"
import { Button } from "$src/components/ui/Button"
import { getPostVisibility } from "$src/lib/post-helpers"
import { formatDate } from "$src/lib/date"

export default function DashboardPostsPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string

  const [visibility, setVisibility] = useState(PostVisibility.All)

  const [postsResult, refreshPostsResult] = usePostsForDashboardQuery({
    variables: {
      domainOrSubdomain: subdomain,
      visibility,
    },
    pause: !subdomain,
  })

  const [, deletePostMutation] = useDeletePostMutation()

  const posts = postsResult.data?.site?.posts
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([])

  const toggleSelectedPostId = (id: string) => {
    setSelectedPostIds((ids) => {
      if (selectedPostIds.includes(id)) {
        return ids.filter((_id) => _id !== id)
      }
      return [...ids, id]
    })
  }

  const hasSelectedPostIds = selectedPostIds.length > 0

  const deletedSelectedPosts = async () => {
    if (prompt(`Enter "delete" to deleted selected posts`) !== "delete") {
      return
    }

    let deleted = 0
    let failed = 0
    const total = selectedPostIds.length
    const toastId = toast.loading(`${deleted}/${total} Deleting..`)

    await Promise.all(
      selectedPostIds.map(async (id) => {
        const title = posts?.nodes.find((post) => post.id === id)?.title
        toast.loading(`${deleted} Deleting ${title || id}..`, {
          id: toastId,
        })
        const { error } = await deletePostMutation({
          id,
        })
        if (error) {
          failed++
          toast.error(error.message)
        } else {
          deleted++
          toast.loading(`${deleted} Deleted ${title || id}`, {
            id: toastId,
          })
        }
      }),
    )

    setSelectedPostIds([])
    refreshPostsResult()

    if (failed > 0) {
      toast.error(`${deleted} deleted, ${failed} failed`, {
        id: toastId,
      })
    } else {
      toast.success(`Deleted ${deleted} posts`, {
        id: toastId,
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="px-12 mt-1 flex items-center justify-between h-12 text-sm">
        <div>
          <select
            className="-ml-1 mr-3 bg-zinc-100 shadow-button rounded-md p-1"
            onChange={(e) => setVisibility(e.target.value as PostVisibility)}
          >
            <option value={PostVisibility.All}>All Posts</option>
            <option value={PostVisibility.Draft}>Drafts</option>
            <option value={PostVisibility.Published}>Published</option>
            <option value={PostVisibility.Scheduled}>Scheduled</option>
          </select>
          {hasSelectedPostIds && (
            <>
              <Button
                size="small"
                variantColor="red"
                type="button"
                onClick={deletedSelectedPosts}
              >
                Delete
              </Button>
              <span className="ml-3 text-zinc-400">
                {selectedPostIds.length} selected
              </span>
            </>
          )}
        </div>
        <div>
          <Button
            size="small"
            onClick={() => router.push(`/dashboard/${subdomain}/new-post`)}
          >
            New Post
          </Button>
        </div>
      </div>

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
            <a className="group hover:bg-zinc-50 border-b h-12 pr-12 flex items-center">
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
                    `is-${getPostVisibility(post)}`,
                  )}
                ></span>
              </span>
              <span className="w-full px-3">{post.title}</span>
              <span className="flex-shrink-0 text-zinc-400 text-sm">
                {formatDate(post.publishedAt)}
              </span>
            </a>
          </Link>
        )
      })}
    </DashboardLayout>
  )
}
