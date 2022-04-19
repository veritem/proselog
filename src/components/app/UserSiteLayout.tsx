import { useRouter } from "next/router"
import { gql } from "graphql-tag"
import { useUserSiteLayoutQuery } from "$src/generated/graphql"
import Link from "next/link"
import { Avatar } from "$src/components/ui/Avatar"
import Head from "next/head"
import { getUserContentsUrl } from "$src/lib/user-contents-helpers"
import React from "react"

gql`
  query UserSiteLayout($domainOrSubdomain: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      name
      bio
      subdomain
      owner {
        id
        name
        avatar
      }
    }
  }
`

export const UserSiteLayout: React.FC<{
  children: React.ReactNode
  title?: string
}> = ({ children, title }) => {
  const router = useRouter()
  const domainOrSubdomain = router.query.domain as string

  const [siteResult] = useUserSiteLayoutQuery({
    variables: {
      domainOrSubdomain,
    },
    pause: !domainOrSubdomain,
  })

  const site = siteResult.data?.site
  const avatars = [getUserContentsUrl(site?.owner.avatar)]

  return (
    <>
      <Head>
        <title>{title || site?.name}</title>
      </Head>
      <div>
        <header className="py-10 text-center">
          <div className="mb-1">
            <Link href="/">
              <a>
                <Avatar images={avatars} name={site?.name} />
              </a>
            </Link>
          </div>
          <h1 className="text-zinc-600">
            <Link href={"/"}>
              <a>{site?.name}</a>
            </Link>
          </h1>
          {site?.bio && (
            <div className="text-sm mt-1 max-w-md mx-auto text-zinc-300">
              {site?.bio}
            </div>
          )}
        </header>
        <div className="max-w-screen-md mx-auto px-5">{children}</div>
      </div>
    </>
  )
}
