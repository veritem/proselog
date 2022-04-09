import { Button } from "$src/components/ui/Button"
import {
  useCreatePostMutation,
  useSiteBySubdomainQuery,
} from "$src/generated/graphql"
import { useFormik } from "formik"
import { useRouter } from "next/router"

export default function NewPostPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [, createPostMutation] = useCreatePostMutation()
  const [siteBySubdomain] = useSiteBySubdomainQuery({
    variables: {
      subdomain: subdomain,
    },
    pause: !subdomain,
  })

  const form = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    async onSubmit(values) {
      const { error } = await createPostMutation({
        siteId: siteBySubdomain.data?.viewer?.siteBySubdomain?.id!,
        title: values.title,
        content: values.content,
      })
      if (error) {
        alert(error)
      } else {
        alert("success")
      }
    },
  })

  return (
    <div className="max-w-2xl mx-auto py-5">
      <form onSubmit={form.handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            value={form.values.title}
            onChange={form.handleChange}
            className="border-none text-xl w-full focus:outline-none"
            placeholder="Title goes here.."
          />
        </div>
        <div className="mt-5">
          <textarea
            className="border w-full"
            name="content"
            value={form.values.content}
            onChange={form.handleChange}
            rows={30}
          ></textarea>
        </div>
        <div className="mt-5">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  )
}
