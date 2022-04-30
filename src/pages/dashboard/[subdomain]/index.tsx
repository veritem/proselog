import { DashboardLayout } from "$src/components/app/DashboardLayout"
import {
  PageVisibilityEnum,
  useSubdomainIndexDataQuery,
  useUpdateMembershipLastSwitchedToMutation,
} from "$src/generated/graphql"
import gql from "graphql-tag"
import { useRouter } from "next/router"
import { useEffect } from "react"

gql`
  query SubdomainIndexData($site: String!, $visibility: PageVisibilityEnum) {
    site(site: $site) {
      id
      name
      subdomain
      stats {
        id
        postCount
        subscriberCount
      }
      pages(type: POST, visibility: $visibility) {
        nodes {
          id
          title
          publishedAt
          published
        }
      }
    }
  }
`

export default function SubdomainIndex() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string

  const visibility = PageVisibilityEnum.All
  const [queryResult] = useSubdomainIndexDataQuery({
    variables: {
      site: subdomain,
      visibility,
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

  const stats = queryResult.data?.site.stats

  return (
    <DashboardLayout documentTitle={"Dashboard"}>
      <div className="p-5 lg:max-w-screen-lg  2xl:max-w-screen-xl mx-auto">
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
