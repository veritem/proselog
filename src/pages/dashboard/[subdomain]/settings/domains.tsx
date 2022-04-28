import { SiteSettingsLayout } from "$src/components/app/SiteSettingsLayout"
import { Avatar } from "$src/components/ui/Avatar"
import { AvatarEditor } from "$src/components/ui/AvatarEditor"
import { Button } from "$src/components/ui/Button"
import { Input } from "$src/components/ui/Input"
import { OUR_DOMAIN } from "$src/config"
import { useSiteQuery, useUpdateSiteMutation } from "$src/generated/graphql"
import { useClientSaveAvatar } from "$src/lib/client-save-avatar"
import { getUserContentsUrl } from "$src/lib/user-contents-helpers"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function SiteSettingsDomainsPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [siteResult] = useSiteQuery({
    variables: {
      domainOrSubdomain: subdomain,
    },
    pause: !subdomain,
  })
  const [, updateSiteMutation] = useUpdateSiteMutation()

  const site = siteResult.data?.site

  const form = useFormik({
    initialValues: {
      subdomain,
    },
    async onSubmit(values) {
      const { error, data } = await updateSiteMutation({
        id: site!.id,
        subdomain: values.subdomain,
      })
      if (error) {
        toast.error(error.message)
      } else if (data) {
        toast.success("Subdomain has been updated")
        router.push(`/dashboard/${values.subdomain}/settings/domains`)
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
        subdomain: siteResult.data.site.subdomain,
      })
    }
  }, [siteResult.data])

  return (
    <SiteSettingsLayout subdomain={subdomain}>
      <form onSubmit={form.handleSubmit}>
        <div className="">
          <Input
            name="subdomain"
            id="subdomain"
            label="Subdomain"
            addon={`.${OUR_DOMAIN}`}
            value={form.values.subdomain}
            onChange={form.handleChange}
            className="w-28"
          />
        </div>
        <div className="mt-5">
          <Button type="submit" isLoading={form.isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </SiteSettingsLayout>
  )
}
