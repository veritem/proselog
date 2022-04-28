import { useDashboardSiteDataQuery } from "$src/generated/graphql"
import clsx from "clsx"
import gql from "graphql-tag"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { SiteSwitcher } from "./SiteSwitcher"

gql`
  query DashboardSiteData($domainOrSubdomain: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      name
    }
  }
`

export const Sidebar: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="w-sidebar fixed top-0 bottom-0 left-0 bg-zinc-50 z-10">
      {children}
      <div className="w-[1px] bg-border absolute top-0 right-0 bottom-0"></div>
    </div>
  )
}

export const Main: React.FC<{
  children: React.ReactNode
  fullWidth?: boolean
}> = ({ children, fullWidth }) => {
  return (
    <div className="md:pl-sidebar w-full">
      <div
        className={clsx(
          fullWidth ? "" : "max-w-screen-xl relative px-5 py-5 md:px-10",
        )}
      >
        {children}
      </div>
    </div>
  )
}

export const DashboardLayout: React.FC<{
  children?: React.ReactNode
  documentTitle?: string
  fullWidth?: boolean
}> = ({ children, documentTitle, fullWidth }) => {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [siteDataResult] = useDashboardSiteDataQuery({
    variables: {
      domainOrSubdomain: subdomain,
    },
    pause: !subdomain,
  })
  const links: {
    href: string
    isActive: (ctx: { href: string; pathname: string }) => boolean
    icon: React.ReactNode
    text: string
  }[] = [
    {
      href: `/dashboard/${subdomain}`,
      isActive: ({ href, pathname }) => href === pathname,
      icon: (
        <svg width="1em" height="1em" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h7v9H3zm11 0h7v5h-7zm0 9h7v9h-7zM3 16h7v5H3z"
          ></path>
        </svg>
      ),
      text: "Dashboard",
    },
    {
      href: `/dashboard/${subdomain}/posts`,
      isActive: ({ href, pathname }) => href === pathname,
      icon: (
        <svg width="1em" height="1em" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
          ></path>
          <path
            fill="currentColor"
            d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
          ></path>
        </svg>
      ),
      text: "Posts",
    },
    {
      href: `/dashboard/${subdomain}/pages`,
      isActive: ({ href, pathname }) => href === pathname,
      icon: (
        <svg width="1em" height="1em" viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
          >
            <path d="M12 11h5m-5-4h5m-9 8V3.6a.6.6 0 0 1 .6-.6h11.8a.6.6 0 0 1 .6.6V17a4 4 0 0 1-4 4v0"></path>
            <path d="M5 15h7.4c.331 0 .603.267.63.597C13.153 17.115 13.78 21 17 21H6a3 3 0 0 1-3-3v-1a2 2 0 0 1 2-2Z"></path>
          </g>
        </svg>
      ),
      text: "Pages",
    },
    {
      href: `/dashboard/${subdomain}/settings/general`,
      isActive: ({ pathname }) =>
        pathname.startsWith(`/dashboard/${subdomain}/settings`),
      icon: (
        <svg width="1em" height="1em" viewBox="0 0 16 16">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          >
            <circle cx="8" cy="8" r="1.75"></circle>
            <path d="m6.75 1.75l-.5 1.5l-1.5 1l-2-.5l-1 2l1.5 1.5v1.5l-1.5 1.5l1 2l2-.5l1.5 1l.5 1.5h2.5l.5-1.5l1.5-1l2 .5l1-2l-1.5-1.5v-1.5l1.5-1.5l-1-2l-2 .5l-1.5-1l-.5-1.5z"></path>
          </g>
        </svg>
      ),
      text: "Settings",
    },
    {
      href: `/dashboard/${subdomain}/account/profile`,
      isActive: ({ pathname }) =>
        pathname.startsWith(`/dashboard/${subdomain}/account`),
      icon: (
        <svg width="1em" height="1em" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm-4.987-3.744A7.966 7.966 0 0 0 12 20a7.97 7.97 0 0 0 5.167-1.892A6.979 6.979 0 0 0 12.16 16a6.981 6.981 0 0 0-5.147 2.256zM5.616 16.82A8.975 8.975 0 0 1 12.16 14a8.972 8.972 0 0 1 6.362 2.634a8 8 0 1 0-12.906.187zM12 13a4 4 0 1 1 0-8a4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4a2 2 0 0 0 0 4z"
          ></path>
        </svg>
      ),
      text: "Account",
    },
  ]

  const siteName = siteDataResult.data?.site.name

  return (
    <>
      <Head>
        <title>
          {documentTitle && siteName && `${documentTitle} - ${siteName}`}
        </title>
      </Head>
      <div className="flex">
        <Sidebar>
          <div className="mb-2">
            <SiteSwitcher subdomain={subdomain} />
          </div>

          <div className="px-3 space-y-[2px] text-zinc-500">
            {links.map((link) => {
              const active = link.isActive({
                pathname: router.asPath,
                href: link.href,
              })
              return (
                <Link href={link.href} key={link.href}>
                  <a
                    className={clsx(
                      `flex px-2 h-8 text-sm items-center rounded-lg`,
                      active
                        ? `bg-gray-200 font-medium text-gray-800`
                        : `hover:bg-gray-200 hover:bg-opacity-50`,
                    )}
                  >
                    <span className="mr-2 text-lg">{link.icon}</span>
                    <span>{link.text}</span>
                  </a>
                </Link>
              )
            })}
          </div>
        </Sidebar>
        <Main fullWidth={fullWidth}>{children}</Main>
      </div>
    </>
  )
}
