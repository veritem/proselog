import {
  useUpdateSiteMutation,
  useUpdateUserProfileMutation,
} from "$src/generated/graphql"
import toast from "react-hot-toast"
import { uploadFileInBrowser } from "./client-upload"

export const useClientSaveAvatar = ({ type }: { type: "user" | "site" }) => {
  const [, updateProfile] = useUpdateUserProfileMutation()
  const [, updateSite] = useUpdateSiteMutation()
  const isSite = type === "site"

  return async (docId: string, blob: Blob) => {
    const { filename } = await uploadFileInBrowser(blob)
    const { error, data } = isSite
      ? await updateSite({
          id: docId,
          icon: filename,
        })
      : await updateProfile({
          userId: docId,
          avatar: filename,
        })
    if (error) {
      toast.error(error.message)
    } else if (data) {
      toast.success(isSite ? "Site icon updated" : "Profile picture updated")
    }
  }
}
