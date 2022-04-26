import { Button } from "$src/components/ui/Button"
import { Editor } from "$src/components/ui/Editor"
import {
  PageTypeEnum,
  PageVisibilityEnum,
  useCreateOrUpdatePageMutation,
  usePageForEditPageQuery,
  useSiteIdBySubdomainQuery,
} from "$src/generated/graphql"
import { Popover } from "@headlessui/react"
import clsx from "clsx"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import { usePageVisibility } from "$src/lib/page-helpers"
import { DashboardLayout } from "./DashboardLayout"

const getInputDatetimeValue = (date: Date | string) => {
  const str = dayjs(date).format()
  return str.substring(0, ((str.indexOf("T") | 0) + 6) | 0)
}

export const PageEditor: React.FC<{ type: PageTypeEnum }> = ({ type }) => {
  const router = useRouter()
  const pageId = router.query.pageId as string | undefined
  const subdomain = router.query.subdomain as string
  const [, createOrUpdatePageMutation] = useCreateOrUpdatePageMutation()

  const [published, setPublished] = useState(false)
  const [publishedAt, setPublishedAt] = useState<Date | null>(null)
  const [pageForEditPageQuery] = usePageForEditPageQuery({
    variables: {
      slugOrId: pageId!,
    },
    pause: !pageId,
  })
  const [siteIdBySubdomainQuery] = useSiteIdBySubdomainQuery({
    variables: {
      subdomain,
    },
    pause: !subdomain,
  })

  const [form, setForm] = useState({
    title: "",
    content: "",
    publishedAt: dayjs().format(),
    published: false,
  })
  const [formSubmitting, setFormSubmitting] = useState(false)

  const updateField = (field: keyof typeof form, value: any) => {
    setForm((form) => ({
      ...form,
      [field]: value,
    }))
  }

  const submit = async ({ onSuccess }: { onSuccess: () => void }) => {
    setFormSubmitting(true)
    try {
      const { error, data } = await createOrUpdatePageMutation({
        siteId: siteIdBySubdomainQuery.data!.site.id,
        pageId,
        title: form.title,
        content: form.content,
        publishedAt: new Date(form.publishedAt),
        published: form.published,
        type,
      })
      if (error) {
        toast.error(error.message)
      } else if (data) {
        onSuccess()
        toast.success("success")
        if (!pageId) {
          router.push(
            `/dashboard/${subdomain}/edit-${
              type === PageTypeEnum.Post ? "post" : "page"
            }/${data.createOrUpdatePage.id}`,
          )
        }
      }
    } finally {
      setFormSubmitting(false)
    }
  }

  const goBack = () => {
    router.push(`/dashboard/${subdomain}/`)
  }

  const openSettings = () => {}

  const visibility = usePageVisibility({ published, publishedAt })

  useEffect(() => {
    if (pageForEditPageQuery.data) {
      setForm({
        ...form,
        title: pageForEditPageQuery.data.page.title,
        content: pageForEditPageQuery.data.page.content,
        published: pageForEditPageQuery.data.page.published,
        publishedAt: pageForEditPageQuery.data.page.publishedAt,
      })
      setPublished(pageForEditPageQuery.data.page.published)
      setPublishedAt(new Date(pageForEditPageQuery.data.page.publishedAt))
    }
  }, [pageForEditPageQuery.data])

  return (
    <DashboardLayout documentTitle={form.title}>
      <div className="flex justify-between absolute top-0 left-0 right-0 z-10 px-5 h-14 border-b items-center text-sm">
        <div></div>
        <div className="flex items-center space-x-3">
          <span
            className={clsx(
              `text-sm`,
              published ? `text-indigo-500` : `text-zinc-300`,
            )}
          >
            {visibility === PageVisibilityEnum.Published
              ? "Published"
              : visibility === PageVisibilityEnum.Scheduled
              ? "Scheduled"
              : "Draft"}
          </span>
          <Popover className="relative">
            <Popover.Button className="button is-primary rounded-lg select-none">
              Publish
            </Popover.Button>

            <Popover.Panel className="absolute right-0 z-10 pt-2">
              {({ close }) => {
                return (
                  <div className="border p-5 rounded-lg min-w-[240px] bg-white shadow-modal">
                    <div className="space-y-3">
                      <label className="block">
                        <span className="block text-zinc-400 font-medium text-sm">
                          Publish at
                        </span>
                        <input
                          type="datetime-local"
                          value={getInputDatetimeValue(form.publishedAt)}
                          onChange={(e) => {
                            updateField("publishedAt", e.target.value)
                          }}
                        />
                      </label>
                      <label className="block">
                        <span className="block text-zinc-400 font-medium text-sm">
                          Status
                        </span>
                        <input
                          type="checkbox"
                          checked={form.published}
                          onChange={(e) =>
                            updateField("published", e.target.checked)
                          }
                        />{" "}
                        {form.published ? "Published" : "Draft"}
                      </label>
                    </div>
                    <div className="mt-5">
                      <Button
                        isLoading={formSubmitting}
                        onClick={() => submit({ onSuccess: close })}
                      >
                        {published ? "Update" : "Publish"}
                      </Button>
                    </div>
                  </div>
                )
              }}
            </Popover.Panel>
          </Popover>
        </div>
      </div>
      <div className="h-screen pt-14 flex w-full">
        <div className="h-full overflow-auto w-full">
          <div className="max-w-screen-md mx-auto py-5 px-5">
            <div>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="h-12 inline-flex items-center border-none text-xl w-full focus:outline-none"
                placeholder="Title goes here.."
              />
            </div>
            <div className="mt-5">
              <div className="">
                <Editor
                  value={form.content}
                  onChange={(value) => updateField("content", value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-full overflow-auto flex-shrink-0 w-[280px] border-l bg-gray-50 p-5">
          settings
        </div>
      </div>
    </DashboardLayout>
  )
}
