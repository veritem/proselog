import { SettingsLayout } from "$src/components/app/SettingsLayout"
import { Button } from "$src/components/ui/Button"
import {
  useUpdateUserProfileMutation,
  useViewerQuery,
} from "$src/generated/graphql"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function AccountSettingsPage() {
  const router = useRouter()

  const [viewerResult] = useViewerQuery({})
  const [, updateUserProfileMutation] = useUpdateUserProfileMutation()

  const form = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
    },
    async onSubmit(values) {
      const { error, data } = await updateUserProfileMutation({
        userId: viewerResult.data!.viewer!.id,
        name: values.name,
        username: values.username,
        email: values.email,
      })
      if (error) {
        toast.error(error.message)
      } else if (data) {
        toast.success("Profile updated")
      }
    },
  })

  useEffect(() => {
    if (viewerResult.data) {
      const viewer = viewerResult.data.viewer
      if (!viewer) {
        alert("User not found")
        return
      }
      form.setValues({
        name: viewer.name,
        username: viewer.username,
        email: viewer.email,
      })
    }
  }, [viewerResult.data])

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
        <div className="mt-5">
          <label htmlFor="name" className="block mb-2 text-sm">
            Username
          </label>
          <input
            id="username"
            className="input"
            name="username"
            required
            value={form.values.username}
            onChange={form.handleChange}
          />
        </div>
        <div className="mt-5">
          <label htmlFor="name" className="block mb-2 text-sm">
            Email
          </label>
          <input
            id="email"
            className="input"
            name="email"
            required
            type="email"
            value={form.values.email}
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
