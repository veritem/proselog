import { useRouter } from "next/router"
import { gql } from "graphql-tag"
import { useUserSiteLayoutQuery } from "$src/generated/graphql"
import Link from "next/link"
import { Avatar } from "$src/components/ui/Avatar"
import Head from "next/head"
import { getUserContentsUrl } from "$src/lib/user-contents-helpers"
import React from "react"
import { Button } from "../ui/Button"
import clsx from "clsx"

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

  const navLinks = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "About",
      href: "/about",
    },
    {
      text: "Archives",
      href: "/archives",
    },
  ]

  return (
    <>
      <Head>
        <title>{title ? `${title} - ${site?.name}` : site?.name}</title>
      </Head>
      <div>
        <header className="border-b fixed top-0 left-0 right-0 h-16 backdrop-blur-lg">
          <div className="flex justify-between items-center h-16 px-5 md:px-8">
            <div className="flex items-center">
              <Link href="/">
                <a className="flex items-center space-x-3 hover:text-indigo-500">
                  <Avatar
                    images={avatars}
                    size={36}
                    name={site?.name}
                    rounded={false}
                  />
                  <span className="font-medium">{site?.name}</span>
                </a>
              </Link>
              <button
                type="button"
                className="ml-3 text-white bg-indigo-500 border border-indigo-500 rounded-lg h-7 flex items-center px-2 text-xs"
              >
                Subscribe
              </button>
            </div>
            <div className="flex items-center text-zinc-500">
              <div className="space-x-5">
                {navLinks.map((link) => {
                  const active = router.asPath === link.href
                  return (
                    <Link href={link.href} key={link.text}>
                      <a className={clsx(active ? `text-indigo-500` : ``)}>
                        {link.text}
                      </a>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-screen-md mx-auto px-5 pt-28 pb-12">
          {children}
        </div>
      </div>
    </>
  )
}
