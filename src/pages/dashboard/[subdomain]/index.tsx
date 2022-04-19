import { DashboardLayout } from "$src/components/app/DashboardLayout"
import {
  useSubdomainIndexDataQuery,
  useUpdateMembershipLastSwitchedToMutation,
} from "$src/generated/graphql"
import gql from "graphql-tag"
import { useRouter } from "next/router"
import { useEffect } from "react"

gql`
  query SubdomainIndexData($domainOrSubdomain: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      name
      subdomain
      stats {
        id
        postCount
        subscriberCount
      }
    }
  }
`

export default function SubdomainIndex() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string

  const [queryResult] = useSubdomainIndexDataQuery({
    variables: {
      domainOrSubdomain: subdomain,
    },
    pause: !subdomain,
  })
  const [, updateMembershipLastSwitchedTo] =
    useUpdateMembershipLastSwitchedToMutation()

  useEffect(() => {
    if (queryResult.data) {
      updateMembershipLastSwitchedTo({
        siteId: queryResult.data.site.id,
      })
    }
  }, [queryResult.data])

  const siteName = queryResult.data?.site.name
  const stats = queryResult.data?.site.stats

  return (
    <DashboardLayout documentTitle={"Dashboard"}>
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
