import { AppLayout } from "$src/components/app/AppLayout"
import { Button } from "$src/components/ui/Button"
import { useCreateSiteMutation } from "$src/generated/graphql"
import { useFormik } from "formik"
import { useRouter } from "next/router"

export default function NewSite() {
  const router = useRouter()
  const [, createSiteMutation] = useCreateSiteMutation()

  const form = useFormik({
    initialValues: {
      name: "",
      subdomain: "",
    },
    async onSubmit(values) {
      const { error } = await createSiteMutation({
        name: values.name,
        subdomain: values.subdomain,
      })
      if (error) {
        alert(error)
      } else {
        router.push(`/dashboard/${values.subdomain}`)
      }
    },
  })
  return (
    <AppLayout>
      <div className="max-w-sm mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">New Site</h2>
        <form onSubmit={form.handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 font-medium block">Site Name</label>
            <input
              type="text"
              name="name"
              className="input is-block"
              required
              value={form.values.name}
              onChange={form.handleChange}
            />
          </div>
          <div>
            <label className="mb-1 font-medium block">Subdomain</label>
            <input
              type="text"
              name="subdomain"
              className="input is-block"
              required
              value={form.values.subdomain}
              onChange={form.handleChange}
            />
          </div>
          <div>
            <Button type="submit" isBlock isLoading={form.isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
