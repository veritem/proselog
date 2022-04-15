import { SettingsLayout } from "$src/components/app/SettingsLayout"
import { Button } from "$src/components/ui/Button"
import { useSiteQuery, useUpdateSiteMutation } from "$src/generated/graphql"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function AccountSettingsPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [siteResult] = useSiteQuery({
    variables: {
      domainOrSubdomain: subdomain,
    },
    pause: !subdomain,
  })
  const [, updateSiteMutation] = useUpdateSiteMutation()

  const form = useFormik({
    initialValues: {
      name: "",
    },
    async onSubmit(values) {
      const site = siteResult.data?.site!
      const { error, data } = await updateSiteMutation({
        id: site.id,
        name: values.name,
      })
      if (error) {
        toast.error(error.message)
      } else if (data) {
        toast.success("Site updated")
      }
    },
  })

  useEffect(() => {
    if (siteResult.data) {
      const site = siteResult.data.site
      if (!site) {
        alert("Site not found")
        return
      }
      form.setValues({
        name: site.name,
      })
    }
  }, [siteResult.data])

  return (
    <SettingsLayout title="Account Settings">
      <form onSubmit={form.handleSubmit}>
        <div>
          <label htmlFor="name" className="block mb-2 text-sm">
            Name
          </label>
          <input
            id="name"
            className="input"
            name="name"
            required
            value={form.values.name}
            onChange={form.handleChange}
          />
        </div>
        <div className="mt-10">
          <Button type="submit" isLoading={form.isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </SettingsLayout>
  )
}
