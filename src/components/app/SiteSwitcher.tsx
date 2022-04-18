import { useSitesForSiteSwitcherQuery } from "$src/generated/graphql"
import { gql } from "graphql-tag"
import { Popover } from "@headlessui/react"
import Link from "next/link"

gql`
  query sitesForSiteSwitcher {
    viewer {
      id
      email
      emailVerified
      memberships(roles: ["ADMIN", "OWNER"]) {
        id
        site {
          id
          name
          subdomain
        }
      }
    }
  }
`

export const SiteSwitcher: React.FC<{ subdomain: string }> = ({
  subdomain,
}) => {
  const [sitesResult] = useSitesForSiteSwitcherQuery({})
  const sites = sitesResult.data?.viewer?.memberships.map((m) => m.site)
  const activeSite = sites?.find((s) => s.subdomain === subdomain)
  return (
    <div className="px-3 pt-3 pb-2 text-sm">
      <Popover className="relative">
        <Popover.Button className="h-8 px-2 flex w-full rounded-lg hover:bg-zinc-200 transition-colors items-center justify-start">
          <span className="truncate">{activeSite?.name}</span>
        </Popover.Button>
        <Popover.Panel className="absolute left-0 z-10 pt-1 ">
          <div className="min-w-[280px] rounded-lg shadow-modal bg-white">
            <div className="px-4 py-2 border-b text-sm text-zinc-500">
              {sitesResult.data?.viewer?.email}
            </div>
            <div className="p-2">
              {sites?.map((site) => {
                return (
                  <a
                    key={site.id}
                    href={`/dashboard/${site.subdomain}`}
                    className="flex px-2 h-8 rounded-lg items-center justify-between hover:bg-zinc-100"
                  >
                    <span className="truncate w-8/12">{site.name}</span>
                    {activeSite?.id === site.id && (
                      <span className="text-indigo-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </a>
                )
              })}
            </div>
            <div className="border-t py-2 px-2">
              <Link href={`/dashboard/new-site`}>
                <a className="rounded-lg text-sm text-zinc-500 flex px-2 h-8 items-center hover:bg-zinc-100">
                  Create a new site
                </a>
              </Link>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  )
}
