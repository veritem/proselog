import { AccountSettingsLayout } from "$src/components/app/AccountSettingsLayout"
import { Avatar } from "$src/components/ui/Avatar"
import { AvatarEditor } from "$src/components/ui/AvatarEditor"
import { Button } from "$src/components/ui/Button"
import { Input } from "$src/components/ui/Input"
import {
  useUpdateUserProfileMutation,
  useViewerQuery,
} from "$src/generated/graphql"
import { useClientSaveAvatar } from "$src/lib/client-save-avatar"
import { getUserContentsUrl } from "$src/lib/user-contents-helpers"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import toast from "react-hot-toast"

export default function AccountSettingsPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string | undefined
  const [viewerResult] = useViewerQuery({})
  const [, updateUserProfileMutation] = useUpdateUserProfileMutation()
  const clientSaveAvatar = useClientSaveAvatar({ type: "user" })

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
    <AccountSettingsLayout subdomain={subdomain}>
      <form onSubmit={form.handleSubmit}>
        <div>
          <label className="label">Profile Picture</label>
          <AvatarEditor
            render={({ onClick }) => (
              <Avatar
                images={[getUserContentsUrl(viewerResult.data?.viewer?.avatar)]}
                size={140}
                name={viewerResult.data?.viewer?.name}
                tabIndex={-1}
                className="cursor-default focus:ring-2 ring-offset-1 ring-zinc-200"
                onClick={onClick}
              />
            )}
            saveAvatar={(blob) =>
              clientSaveAvatar(viewerResult.data!.viewer!.id, blob)
            }
          />
        </div>
        <div className="mt-5">
          <Input
            label="Display Name"
            id="name"
            name="name"
            required
            type="text"
            value={form.values.name}
            onChange={form.handleChange}
          />
        </div>
        <div className="mt-5">
          <Input
            label="Username"
            id="username"
            name="username"
            required
            type="text"
            value={form.values.username}
            onChange={form.handleChange}
          />
        </div>
        <div className="mt-5">
          <Input
            label="Email"
            id="email"
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
    </AccountSettingsLayout>
  )
}
