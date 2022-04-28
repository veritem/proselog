import { DashboardLayout } from "$src/components/app/DashboardLayout"
import {
  useDeletePageMutation,
  PageVisibilityEnum,
  useSitePagesQuery,
  PageTypeEnum,
} from "$src/generated/graphql"
import Link from "next/link"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import toast from "react-hot-toast"
import { getPageVisibility } from "$src/lib/page-helpers"
import { formatDate } from "$src/lib/date"
import { TabItem, Tabs } from "../ui/Tabs"
import { Menu, Popover } from "@headlessui/react"
import clsx from "clsx"

export const PagesManager: React.FC<{ type: PageTypeEnum }> = ({ type }) => {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const isPost = type === PageTypeEnum.Post

  const [visibility, setVisibility] = useState<PageVisibilityEnum>(
    PageVisibilityEnum.All,
  )

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

  const deletePage = async (id: string) => {
    if (
      prompt(`Enter "delete" to deleted this ${isPost ? "post" : "page"}`) !==
      "delete"
    ) {
      return
    }

    const toastId = toast.loading(`Deleting..`)

    const { error } = await deletePageMutation({
      id,
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Successfully deleted`, {
        id: toastId,
      })
    }

    refreshPagesQuery()
  }

  const tabItems: TabItem[] = [
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
  ].map((item) => ({
    text: item.text,
    onClick: () => setVisibility(item.value),
    active: item.value === visibility,
  }))

  const getPageEditLink = (page: { id: string; type: PageTypeEnum }) => {
    return `/dashboard/${subdomain}/edit-${
      page.type === PageTypeEnum.Post ? "post" : "page"
    }/${page.id}`
  }

  const getPageMenuItems = (page: { id: string; type: PageTypeEnum }) => {
    return [
      {
        text: "Edit",
        icon: (
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        ),
        onClick() {
          router.push(getPageEditLink(page))
        },
      },
      {
        text: "Delete",
        icon: (
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        ),
        onClick() {
          deletePage(page.id)
        },
      },
    ]
  }

  const title = isPost ? "Posts" : "Pages"

  return (
    <DashboardLayout documentTitle={title}>
      <header className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          type="button"
          className="bg-pink-500 space-x-2 px-3 h-9 inline-flex items-center justify-center text-white rounded-lg text-sm"
          onClick={() =>
            router.push(
              `/dashboard/${subdomain}/new-${isPost ? "post" : "page"}`,
            )
          }
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <span>New {isPost ? "Post" : "Page"}</span>
        </button>
      </header>
      <Tabs items={tabItems} />

      <div className="-mt-3">
        {pages && pages.nodes.length === 0 && (
          <div className="my-20 text-center text-3xl text-zinc-400">
            No {isPost ? "Posts" : "Pages"} Yet.
          </div>
        )}

        {pages?.nodes.map((page) => {
          return (
            <Link key={page.id} href={getPageEditLink(page)}>
              <a className="group relative hover:bg-zinc-100 rounded-lg py-3 block px-3 transition-colors -mx-3">
                <div className="flex items-center">
                  <span>{page.title}</span>
                </div>
                <div className="text-zinc-400 text-xs mt-1">
                  <span className="capitalize">
                    {getPageVisibility(page).toLowerCase()}
                  </span>
                  <span className="mx-2">·</span>
                  <span>{formatDate(page.publishedAt)}</span>
                </div>
                <Menu>
                  {({ open }) => (
                    <>
                      <Menu.Button as={Fragment}>
                        <button
                          className={clsx(
                            `absolute z-10 top-1/2 -translate-y-1/2 right-3 text-gray-400 w-8 h-8 rounded hidden group-hover:inline-flex justify-center items-center`,
                            open ? `bg-gray-200` : `hover:bg-gray-200`,
                          )}
                          onClick={(e: any) => {
                            e.stopPropagation()
                            e.preventDefault()
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </Menu.Button>
                      <Menu.Items className="text-sm absolute z-20 right-0 bg-white shadow-modal rounded-lg overflow-hidden py-2 w-64">
                        {getPageMenuItems(page).map((item) => {
                          return (
                            <Menu.Item key={item.text}>
                              <button
                                type="button"
                                className="h-10 flex w-full space-x-2 items-center px-3 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.preventDefault()
                                  item.onClick()
                                }}
                              >
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                              </button>
                            </Menu.Item>
                          )
                        })}
                      </Menu.Items>
                    </>
                  )}
                </Menu>
              </a>
            </Link>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
