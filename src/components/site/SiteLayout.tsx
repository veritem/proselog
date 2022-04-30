import { useRouter } from "next/router"
import { gql } from "graphql-tag"
import { useSiteLayoutDataQuery } from "$src/generated/graphql"
import { Avatar } from "$src/components/ui/Avatar"
import Head from "next/head"
import { getUserContentsUrl } from "$src/lib/user-contents-helpers"
import React from "react"
import clsx from "clsx"
import { clientState } from "$src/lib/client-state"
import { truthy } from "$src/lib/utils"
import { clientLogout } from "$src/lib/client-auth"
import { Button } from "../ui/Button"
import { UniLink } from "../ui/UniLink"
import { SubscribeModal } from "./SubscribeModal"

gql`
  query SiteLayoutData($site: String!) {
    viewer {
      id
    }
    site(site: $site) {
      id
      name
      description
      subdomain
      icon
      subscription {
        id
      }
      owner {
        id
        name
        avatar
      }
    }
  }
`

type MenuLink = {
  text: string
  href?: string
  onClick?: () => void
  hide?: boolean
}

const Header: React.FC<{
  siteName: string | undefined
  description: string | undefined | null
  avatars: (string | null | undefined)[]
  links: MenuLink[]
  subscribed?: boolean
}> = ({ siteName, description, avatars, links, subscribed }) => {
  const router = useRouter()
  return (
    <header className="border-b">
      <div className="px-5 max-w-screen-md mx-auto">
        <div className="flex py-10">
          <div className="flex space-x-6 items-center">
            <Avatar images={avatars} size={100} name={siteName} />
            <div>
              <div className="text-2xl font-bold">{siteName}</div>
              {description && (
                <div className="text-gray-500 text-sm">{description}</div>
              )}
              <div className="mt-3 text-sm">
                <Button
                  rounded="full"
                  size="sm"
                  variant={subscribed ? "secondary" : "primary"}
                  onClick={() => (clientState.subscribeModalOpened = true)}
                >
                  <span className="-ml-1">
                    {subscribed ? (
                      <svg
                        className="w-4 h-4 mr-[2px]"
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
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                  <span>{subscribed ? "Subscribed" : "Subscribe"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <div className="flex items-center space-x-5">
            {links.map((link, i) => {
              const active = router.asPath === link.href
              return (
                <UniLink
                  key={`${link.text}${i}`}
                  href={link.href}
                  onClick={link.onClick}
                  className={clsx(
                    `h-10 flex items-center border-b-2 hover:border-gray-500 hover:text-gray-700`,
                    active
                      ? `text-indigo-700 border-accent`
                      : `border-transparent`,
                  )}
                >
                  {link.text}
                </UniLink>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}

export const SiteLayout: React.FC<{
  children: React.ReactNode
  title?: string
}> = ({ children, title }) => {
  const router = useRouter()
  const domainOrSubdomain = router.query.domain as string

  const [queryResult] = useSiteLayoutDataQuery({
    variables: {
      site: domainOrSubdomain,
    },
    pause: !domainOrSubdomain,
  })

  const site = queryResult.data?.site

  const avatars = [getUserContentsUrl(site?.icon)]

  const isLoggedIn = !!queryResult.data?.viewer

  const links: MenuLink[] = [
    { text: "Home", href: "/" },
    {
      text: "About",
      href: "/about",
    },
    { text: "Archives", hide: true, href: "/archives" },
    !isLoggedIn && {
      text: "Log in",
      hide: true,
      onClick() {
        clientState.loginModalOpened = true
      },
    },
    isLoggedIn && { text: "Dashboard", hide: true, href: `/dashboard` },
    isLoggedIn && {
      text: "Log out",
      hide: true,
      onClick() {
        clientLogout()
      },
    },
  ].filter(truthy)

  return (
    <>
      <Head>
        <title>{title ? `${title} - ${site?.name}` : site?.name}</title>
      </Head>
      <div>
        <Header
          links={links}
          siteName={site?.name}
          description={site?.description}
          avatars={avatars}
          subscribed={!!site?.subscription}
        />
        <div className={clsx(`max-w-screen-md mx-auto px-5 pb-12`, `pt-12`)}>
          {children}
        </div>
      </div>
      <SubscribeModal siteId={site?.id} />
    </>
  )
}
