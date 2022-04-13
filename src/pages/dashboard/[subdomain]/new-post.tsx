import {
  useCreatePostMutation,
  useSiteBySubdomainQuery,
} from "$src/generated/graphql"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function NewPostPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [siteBySubdomainResult] = useSiteBySubdomainQuery({
    variables: {
      subdomain,
    },
  })
  const [, createPostMutation] = useCreatePostMutation()

  useEffect(() => {
    if (siteBySubdomainResult.data?.viewer?.siteBySubdomain) {
      createPostMutation({
        title: "Untitled",
        content: "",
        siteId: siteBySubdomainResult.data.viewer.siteBySubdomain.id,
      }).then((res) => {
        if (res.error) {
          alert(res.error)
        } else if (res.data) {
          router.push(
            `/dashboard/${subdomain}/edit-post/${res.data.createPost.id}`,
          )
        }
      })
    }
  }, [siteBySubdomainResult.data])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span>Loading...</span>
    </div>
  )
}
