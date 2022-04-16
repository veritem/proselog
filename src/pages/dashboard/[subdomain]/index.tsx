import { DashboardLayout } from "$src/components/app/DashboardLayout"
import {
  useSiteQuery,
  useUpdateMembershipLastSwitchedToMutation,
} from "$src/generated/graphql"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function SubdomainIndex() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string

  const [siteResult] = useSiteQuery({
    variables: {
      domainOrSubdomain: subdomain,
    },
    pause: !subdomain,
  })
  const [, updateMembershipLastSwitchedTo] =
    useUpdateMembershipLastSwitchedToMutation()

  useEffect(() => {
    if (siteResult.data) {
      updateMembershipLastSwitchedTo({
        siteId: siteResult.data.site.id,
      })
    }
  }, [siteResult.data])

  return <DashboardLayout />
}
