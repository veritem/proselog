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
    <div>
      <div className="flex justify-between px-5 h-20 items-center fixed left-0 top-0 right-0 z-10 backdrop-blur-lg">
        <button
          type="button"
          className="border text-zinc-500 rounded-lg px-3 h-9 inline-flex items-center hover:bg-zinc-100 transition-colors"
          onClick={goBack}
        >
          ⬅️ back
        </button>
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
            <Popover.Button className="button is-primary select-none">
              Publish
            </Popover.Button>

            <Popover.Panel className="absolute right-0 z-10 pt-2">
              {({ close }) => {
                return (
                  <div className="border p-3 rounded-lg min-w-[240px] bg-white shadow-modal">
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
          <button
            type="button"
            className="border text-zinc-500 rounded-lg px-3 h-9 inline-flex items-center hover:bg-zinc-100 transition-colors"
            onClick={openSettings}
          >
            Settings ⚙️
          </button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto py-5 pt-20 px-5">
        <div>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="bg-zinc-100 transition-colors px-3 h-12 rounded-lg inline-flex items-center border-none text-xl w-full focus:outline-none"
            placeholder="Title goes here.."
          />
        </div>
        <div className="mt-5">
          <div className="bg-zinc-100 rounded-lg p-2">
            <Editor
              value={form.content}
              onChange={(value) => updateField("content", value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
