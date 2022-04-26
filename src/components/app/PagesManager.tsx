import { DashboardLayout } from "$src/components/app/DashboardLayout"
import {
  useDeletePageMutation,
  PageVisibilityEnum,
  useSitePagesQuery,
  PageTypeEnum,
} from "$src/generated/graphql"
import Link from "next/link"
import { useRouter } from "next/router"
import clsx from "clsx"
import { useState } from "react"
import toast from "react-hot-toast"
import { Button } from "$src/components/ui/Button"
import { getPageVisibility } from "$src/lib/page-helpers"
import { formatDate } from "$src/lib/date"

export const PagesManager: React.FC<{ type: PageTypeEnum }> = ({ type }) => {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const isPost = type === PageTypeEnum.Post

  const [visibility, setVisibility] = useState(PageVisibilityEnum.All)

  const [pagesQuery, refreshPagesQuery] = useSitePagesQuery({
    variables: {
      domainOrSubdomain: subdomain,
      visibility,
      type,
    },
    pause: !subdomain,
  })

  const [, deletePageMutation] = useDeletePageMutation()

  const pages = pagesQuery.data?.site?.pages
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([])

  const toggleSelectedPageId = (id: string) => {
    setSelectedPageIds((ids) => {
      if (selectedPageIds.includes(id)) {
        return ids.filter((_id) => _id !== id)
      }
      return [...ids, id]
    })
  }

  const hasSelectedPageIds = selectedPageIds.length > 0

  const deletedSelectedPages = async () => {
    if (
      prompt(
        `Enter "delete" to deleted selected ${isPost ? "posts" : "pages"}`,
      ) !== "delete"
    ) {
      return
    }

    let deleted = 0
    let failed = 0
    const total = selectedPageIds.length
    const toastId = toast.loading(`${deleted}/${total} Deleting..`)

    await Promise.all(
      selectedPageIds.map(async (id) => {
        const title = pages?.nodes.find((page) => page.id === id)?.title
        toast.loading(`${deleted} Deleting ${title || id}..`, {
          id: toastId,
        })
        const { error } = await deletePageMutation({
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

    setSelectedPageIds([])
    refreshPagesQuery()

    if (failed > 0) {
      toast.error(`${deleted} deleted, ${failed} failed`, {
        id: toastId,
      })
    } else {
      toast.success(`Deleted ${deleted} ${isPost ? "posts" : "pages"}`, {
        id: toastId,
      })
    }
  }

  const tabs = [
    {
      value: PageVisibilityEnum.All,
      text: `All ${isPost ? "Posts" : "Pages"}`,
    },
    {
      value: PageVisibilityEnum.Published,
      text: "Published",
    },
    {
      value: PageVisibilityEnum.Draft,
      text: "Draft",
    },
    {
      value: PageVisibilityEnum.Scheduled,
      text: "Scheduled",
    },
  ]

  const switchTab = (type: PageTypeEnum) => {}

  return (
    <DashboardLayout documentTitle={isPost ? "Posts" : "Pages"}>
      <div className="border-b h-14">
        <div className="px-5 max-w-screen-xl mx-auto flex items-center justify-between h-full text-sm">
          <div className="h-full">
            <div className="h-full flex items-center space-x-4">
              {tabs.map((tab) => {
                const active = visibility === tab.value
                return (
                  <button
                    type="button"
                    key={tab.text}
                    onClick={() => switchTab(tab.value as any)}
                    className={clsx(
                      `flex border-b-2 h-full items-center mt-[3px] px-2 justify-center`,
                      active
                        ? `border-indigo-500`
                        : `border-transparent hover:border-zinc-300`,
                    )}
                  >
                    {tab.text}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/${subdomain}/new-${isPost ? "post" : "page"}`,
                )
              }
            >
              New {isPost ? "Post" : "Page"}
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-5 py-5">
        {pages && pages.nodes.length === 0 && (
          <div className="my-20 text-center text-3xl text-zinc-400">
            No {isPost ? "Posts" : "Pages"} Yet.
          </div>
        )}

        {pages?.nodes.map((page) => {
          return (
            <Link
              key={page.id}
              href={`/dashboard/${subdomain}/edit-${
                page.type === PageTypeEnum.Post ? "post" : "page"
              }/${page.id}`}
            >
              <a className="group hover:bg-zinc-50 rounded-lg h-12 pr-12 -mx-12 flex items-center">
                <span
                  className={clsx(
                    `relative w-12 group-hover:visible h-12 flex items-center justify-center cursor-default`,
                    !selectedPageIds.includes(page.id) && `invisible`,
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    toggleSelectedPageId(page.id)
                  }}
                >
                  <input
                    type="checkbox"
                    tabIndex={-1}
                    checked={selectedPageIds.includes(page.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      toggleSelectedPageId(page.id)
                    }}
                  />
                </span>
                <span className="flex-shrink-0 flex">
                  <span
                    className={clsx(
                      `post-status-circle`,
                      `is-${getPageVisibility(page)}`,
                    )}
                  ></span>
                </span>
                <span className="w-full px-3">{page.title}</span>
                <span className="flex-shrink-0 text-zinc-400 text-sm">
                  {formatDate(page.publishedAt)}
                </span>
              </a>
            </Link>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
