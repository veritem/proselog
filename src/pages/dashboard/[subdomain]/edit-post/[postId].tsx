import { Button } from "$src/components/ui/Button"
import { Editor } from "$src/components/ui/Editor"
import {
  usePostForEditQuery,
  useUpdatePostMutation,
} from "$src/generated/graphql"
import { Popover } from "@headlessui/react"
import clsx from "clsx"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const getInputDatetimeValue = (date: Date) => {
  const isoString = date.toISOString()

  return isoString.substring(0, ((isoString.indexOf("T") | 0) + 6) | 0)
}

export default function EditPostPage() {
  const router = useRouter()
  const postId = router.query.postId as string
  const subdomain = router.query.subdomain as string
  const [, updatePostMutation] = useUpdatePostMutation()

  const [published, setPublished] = useState(false)
  const [postResult] = usePostForEditQuery({
    variables: {
      slugOrId: postId,
    },
    pause: !postId,
  })

  const [form, setForm] = useState({
    title: "",
    content: "",
    publishedAt: new Date(),
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
      const { error, data } = await updatePostMutation({
        id: postId,
        title: form.title,
        content: form.content,
        publishedAt: form.publishedAt,
        published: form.published,
      })
      if (error) {
        toast.error(error.message)
      } else if (data) {
        onSuccess()
        toast.success("success")
      }
    } finally {
      setFormSubmitting(false)
    }
  }

  const goBack = () => {
    router.push(`/dashboard/${subdomain}/`)
  }

  const openSettings = () => {}

  useEffect(() => {
    if (postResult.data) {
      setForm({
        ...form,
        title: postResult.data.post.title,
        content: postResult.data.post.content,
        published: postResult.data.post.published,
        publishedAt: postResult.data.post.publishedAt
          ? new Date(postResult.data.post.publishedAt)
          : new Date(),
      })
      setPublished(postResult.data.post.published)
    }
  }, [postResult.data])

  return (
    <div>
      <div className="flex justify-between px-5 h-20 items-center fixed left-0 top-0 right-0">
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
            {published ? "Published" : "Draft"}
          </span>
          <Popover className="relative">
            <Popover.Button className="button is-primary select-none">
              Publish
            </Popover.Button>

            <Popover.Panel className="absolute right-0 z-10 pt-2 bg-white">
              {({ close }) => {
                return (
                  <div className="border p-3 rounded-lg min-w-[240px]">
                    <div className="space-y-3">
                      <label className="block">
                        <span className="block text-zinc-400 font-medium text-sm">
                          Publish at
                        </span>
                        <input
                          type="datetime-local"
                          value={getInputDatetimeValue(form.publishedAt)}
                          onChange={(e) =>
                            updateField("publishedAt", e.target.value)
                          }
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
