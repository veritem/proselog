import { DashboardLayout } from "$src/components/app/DashboardLayout"
import {
  useDashboardHomeQuery,
  useUpdateMembershipLastSwitchedToMutation,
} from "$src/generated/graphql"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function SubdomainIndex() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string

  const [dashboardHomeResult] = useDashboardHomeQuery({
    variables: {
      domainOrSubdomain: subdomain,
    },
    pause: !subdomain,
  })
  const [, updateMembershipLastSwitchedTo] =
    useUpdateMembershipLastSwitchedToMutation()

  useEffect(() => {
    if (dashboardHomeResult.data) {
      updateMembershipLastSwitchedTo({
        siteId: dashboardHomeResult.data.site.id,
      })
    }
  }, [dashboardHomeResult.data])

  const stats = dashboardHomeResult.data?.site.stats

  return (
    <DashboardLayout>
      <div className="p-5">
        {stats && (
          <div className="flex space-x-12">
            <div>
              <span className="block mb-1">Posts</span>
              <span className="text-4xl">{stats.postCount}</span>
            </div>
            <div>
              <span className="block mb-1">Subscribers</span>
              <span className="text-4xl">{stats.subscriberCount}</span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
