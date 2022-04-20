import { useRouter } from "next/router"
import { gql } from "graphql-tag"
import { useUserSiteLayoutQuery } from "$src/generated/graphql"
import Link from "next/link"
import { Avatar } from "$src/components/ui/Avatar"
import Head from "next/head"
import { getUserContentsUrl } from "$src/lib/user-contents-helpers"
import React, { useMemo } from "react"
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

const DropdownMenu: React.FC<{ links: { text: string; href: string }[] }> = ({
  links,
}) => {
  const button = useMemo(
    () => (
      <button
        type="button"
        className="ml-5 hover:text-indigo-500 h-10 w-10 rounded-lg flex items-center justify-center"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>
    ),
    [],
  )

  return (
    <div className="inline-flex relative group">
      {button}
      <div className="text-right pb-2 -mt-[1px] -mr-[1px] absolute w-32 right-0 top-0 rounded-lg border hidden bg-white group-hover:block">
        <div className="flex justify-end">{button}</div>
        {links.map((link) => {
          return (
            <Link key={link.href + link.text} href={link.href}>
              <a className="flex h-8 justify-end items-center px-3 w-full hover:text-indigo-500">
                {link.text}
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

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
      text: "About",
      href: "/about",
    },
  ]

  const dropdownLinks = [
    { text: "Archives", href: "/archives" },
    { text: "Settings", href: `/settings` },
    { text: "Log out", href: `/logout` },
  ]

  return (
    <>
      <Head>
        <title>{title ? `${title} - ${site?.name}` : site?.name}</title>
      </Head>
      <div>
        <header className="border-b fixed top-0 left-0 right-0 h-16 bg-white bg-opacity-80 backdrop-blur-lg text-zinc-500">
          <div className="flex justify-between items-center h-16 px-5 max-w-screen-md mx-auto">
            <div className="flex items-center">
              <Link href="/">
                <a className="flex items-center text-lg space-x-3 text-black hover:text-indigo-500">
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
                className="ml-3 text-white bg-indigo-500 border border-indigo-500 rounded-full h-7 flex items-center px-3 text-xs"
              >
                Subscribe
              </button>
            </div>
            <div className="flex items-center">
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
              <DropdownMenu links={dropdownLinks} />
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
