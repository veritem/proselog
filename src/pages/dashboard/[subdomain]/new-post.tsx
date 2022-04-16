import { useCreatePostMutation, useSiteQuery } from "$src/generated/graphql"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function NewPostPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [siteResult] = useSiteQuery({
    variables: {
      domainOrSubdomain: subdomain,
    },
    pause: !subdomain,
  })
  const [, createPostMutation] = useCreatePostMutation()

  useEffect(() => {
    if (siteResult.data?.site) {
      createPostMutation({
        title: "Untitled",
        content: "",
        siteId: siteResult.data?.site.id,
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
  }, [siteResult.data])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span>Loading...</span>
    </div>
  )
}
