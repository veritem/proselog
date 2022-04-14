import { DashboardLayout } from "$src/components/app/DashboardLayout"
import { Button } from "$src/components/ui/Button"
import {
  useSiteBySubdomainQuery,
  useUpdateSiteMutation,
} from "$src/generated/graphql"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function SettingsPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [siteBySubdomainResult] = useSiteBySubdomainQuery({
    variables: {
      subdomain,
    },
    pause: !subdomain,
  })
  const [, updateSiteMutation] = useUpdateSiteMutation()

  const form = useFormik({
    initialValues: {
      name: "",
    },
    async onSubmit(values) {
      const site = siteBySubdomainResult.data?.viewer?.siteBySubdomain!
      await updateSiteMutation({
        id: site.id,
        name: values.name,
      })
    },
  })

  useEffect(() => {
    if (siteBySubdomainResult.data) {
      const site = siteBySubdomainResult.data.viewer?.siteBySubdomain
      if (!site) {
        alert("Site not found")
        return
      }
      form.setValues({
        name: site.name,
      })
    }
  }, [siteBySubdomainResult.data])

  return (
    <DashboardLayout>
      <div className="px-5 py-10 max-w-screen-md mx-auto">
        <div>
          <div className="border-b pb-5 mb-10">
            <h2 className="text-2xl font-medium">Site Settings</h2>
          </div>
          <form onSubmit={form.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                Site Name
              </label>
              <input
                id="name"
                className="input"
                name="name"
                value={form.values.name}
                onChange={form.handleChange}
              />
            </div>
            <div>
              <Button type="submit" isLoading={form.isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
