import { useUpdateUserProfileMutation } from "$src/generated/graphql"
import toast from "react-hot-toast"
import { gql } from "urql"
import { uploadFileInBrowser } from "./client-upload"

export const useClientSaveAvatar = () => {
  const [, updateProfile] = useUpdateUserProfileMutation()

  return async (userId: string, blob: Blob) => {
    const { url } = await uploadFileInBrowser(blob)
    const { error, data } = await updateProfile({
      userId,
      avatar: url,
    })
    if (error) {
      toast.error(error.message)
    } else if (data) {
      toast.success("Profile picture updated")
    }
  }
}
