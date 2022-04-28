import { useRouter } from "next/router"
import { gql } from "graphql-tag"
import { useUserSiteLayoutQuery } from "$src/generated/graphql"
import Link from "next/link"
import { Avatar } from "$src/components/ui/Avatar"
import Head from "next/head"
import { getUserContentsUrl } from "$src/lib/user-contents-helpers"
import React, { useMemo } from "react"
import clsx from "clsx"
import { clientState } from "$src/lib/client-state"
import { truthy } from "$src/lib/utils"
import { clientLogout } from "$src/lib/client-auth"
import { Button } from "../ui/Button"
import { UniLink } from "../ui/UniLink"

gql`
  query UserSiteLayout($domainOrSubdomain: String!) {
    viewer {
      id
    }
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      name
      description
      subdomain
      icon
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

const DropdownMenu: React.FC<{
  links: MenuLink[]
}> = ({ links }) => {
  const button = useMemo(
    () => (
      <button
        type="button"
        className="ml-5 cursor-default hover:text-accent h-10 w-10 rounded-lg flex items-center justify-center"
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
    <div className="relative group">
      {button}
      <div className="group-hover:block hidden -mr-[1px] -mt-[1px] text-right py-3 absolute w-32 right-0 rounded-lg border bg-white ">
        <div className="w-full">
          {links.map((link) => {
            if (link.href) {
              return (
                <Link key={link.href + link.text} href={link.href}>
                  <a className="flex h-8 justify-end items-center px-3 w-full hover:text-indigo-500">
                    <span>{link.text}</span>
                  </a>
                </Link>
              )
            }
            return (
              <button
                key={link.text}
                onClick={link.onClick}
                className="flex h-8 justify-end items-center px-3 w-full hover:text-indigo-500"
              >
                <span>{link.text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const PageHeader: React.FC<{
  links: MenuLink[]
  avatars: (string | null | undefined)[]
  siteName: string | undefined
}> = ({ links, avatars, siteName }) => {
  const router = useRouter()
  const navLinks: MenuLink[] = links.filter((link) => !link.hide)
  const dropdownLinks: MenuLink[] = links.filter((link) => link.hide)

  return (
    <header className="z-10 border-b fixed top-0 left-0 right-0 h-16 bg-white bg-opacity-80 backdrop-blur-lg text-zinc-500">
      <div className="flex justify-between items-center h-16 px-5 max-w-screen-md mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center text-lg space-x-3 text-black hover:text-accent">
              <Avatar images={avatars} size={36} name={siteName} />
              <span className="font-medium">{siteName}</span>
            </a>
          </Link>
          <button
            type="button"
            className="ml-3 text-white bg-accent border border-accent rounded-full h-7 flex items-center px-3 text-xs"
          >
            Subscribe
          </button>
        </div>
        <div className="flex items-center">
          <div className="space-x-5">
            {navLinks.map((link) => {
              if (!link.href) {
                return (
                  <button type="button" key={link.text}>
                    {link.text}
                  </button>
                )
              }
              const active = router.asPath === link.href
              return (
                <Link href={link.href} key={link.text}>
                  <a className={clsx(active ? `text-accent` : ``)}>
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
  )
}

const HomeHeader: React.FC<{
  siteName: string | undefined
  description: string | undefined | null
  avatars: (string | null | undefined)[]
  links: MenuLink[]
}> = ({ siteName, description, avatars, links }) => {
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
                <Button rounded="full" size="sm">
                  Subscribe
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
                    `h-10 flex font-bold items-center border-b-2 hover:border-gray-500 hover:text-gray-700`,
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

export const UserSiteLayout: React.FC<{
  children: React.ReactNode
  title?: string
  useHomeHeader: boolean
}> = ({ children, title, useHomeHeader }) => {
  const router = useRouter()
  const domainOrSubdomain = router.query.domain as string

  const [queryResult] = useUserSiteLayoutQuery({
    variables: {
      domainOrSubdomain,
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
        {useHomeHeader ? (
          <HomeHeader
            links={links}
            siteName={site?.name}
            description={site?.description}
            avatars={avatars}
          />
        ) : (
          <PageHeader links={links} avatars={avatars} siteName={site?.name} />
        )}
        <div
          className={clsx(
            `max-w-screen-md mx-auto px-5 pb-12`,
            useHomeHeader ? `pt-12` : `pt-28`,
          )}
        >
          {children}
        </div>
      </div>
    </>
  )
}
