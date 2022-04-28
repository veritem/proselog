import { SiteSettingsLayout } from "$src/components/app/SiteSettingsLayout"
import { Avatar } from "$src/components/ui/Avatar"
import { AvatarEditor } from "$src/components/ui/AvatarEditor"
import { Button } from "$src/components/ui/Button"
import { Input } from "$src/components/ui/Input"
import {
  useSiteQuery,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
} from "$src/generated/graphql"
import { useClientSaveAvatar } from "$src/lib/client-save-avatar"
import { getUserContentsUrl } from "$src/lib/user-contents-helpers"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function SiteSettingsGeneralPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [siteResult] = useSiteQuery({
    variables: {
      domainOrSubdomain: subdomain,
    },
    pause: !subdomain,
  })
  const [, updateSiteMutation] = useUpdateSiteMutation()
  const [, deleteSiteMutation] = useDeleteSiteMutation()

  const clientSaveAvatar = useClientSaveAvatar({ type: "site" })

  const site = siteResult.data?.site

  const form = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    async onSubmit(values) {
      const { error, data } = await updateSiteMutation({
        id: site!.id,
        name: values.name,
        description: values.description,
      })
      if (error) {
        toast.error(error.message)
      } else if (data) {
        toast.success("Site updated")
      }
    },
  })

  const deleteSiteForm = useFormik({
    initialValues: {},
    async onSubmit() {
      const site = siteResult.data?.site!

      if (prompt(`Enter "${site.name}" to delete the site`) !== site.name) {
        return
      }
      const { error } = await deleteSiteMutation({
        id: site!.id,
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Site deleted")
        router.push("/dashboard")
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
        description: site.description || "",
      })
    }
  }, [siteResult.data])

  return (
    <SiteSettingsLayout subdomain={subdomain}>
      <form onSubmit={form.handleSubmit}>
        <div>
          <label className="label">Icon</label>
          <AvatarEditor
            render={({ onClick }) => (
              <Avatar
                images={[getUserContentsUrl(siteResult.data?.site?.icon)]}
                size={140}
                name={siteResult.data?.site?.name}
                tabIndex={-1}
                className="cursor-default focus:ring-2 ring-offset-1 ring-zinc-200"
                onClick={onClick}
              />
            )}
            saveAvatar={(blob) =>
              clientSaveAvatar(siteResult.data!.site!.id, blob)
            }
          />
        </div>
        <div className="mt-5">
          <Input
            required
            label="Name"
            id="name"
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
          />
        </div>
        <div className="mt-5">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            className="input is-block"
            name="description"
            value={form.values.description}
            onChange={form.handleChange}
            rows={6}
          />
        </div>
        <div className="mt-5">
          <Button type="submit" isLoading={form.isSubmitting}>
            Save
          </Button>
        </div>
      </form>
      <div className="mt-14 border-t pt-8">
        <h3 className="text-red-500 text-lg mb-5">Danger Zone</h3>
        <form onSubmit={deleteSiteForm.handleSubmit}>
          <Button
            variantColor="red"
            type="submit"
            isLoading={deleteSiteForm.isSubmitting}
          >
            Delete Site
          </Button>
        </form>
      </div>
    </SiteSettingsLayout>
  )
}
