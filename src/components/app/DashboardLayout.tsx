import { useDashboardSiteDataQuery } from "$src/generated/graphql"
import clsx from "clsx"
import gql from "graphql-tag"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { SiteSwitcher } from "./SiteSwitcher"

export const Sidebar: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="w-64 bg-zinc-100 fixed top-0 bottom-0 left-0">
      {children}
      <div className="w-[1px] bg-zinc-200 absolute top-0 right-0 bottom-0"></div>
    </div>
  )
}

type MainWidth = "md" | "full"

export const Main: React.FC<{
  children: React.ReactNode
  width?: MainWidth
}> = ({ children, width }) => {
  return (
    <div className="pl-64 w-full">
      <div className={clsx(width === "md" ? `max-w-screen-md` : "w-full")}>
        {children}
      </div>
    </div>
  )
}

gql`
  query DashboardSiteData($domainOrSubdomain: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      name
    }
  }
`

export const DashboardLayout: React.FC<{
  children?: React.ReactNode
  mainWidth?: MainWidth
  documentTitle?: string
}> = ({ children, mainWidth, documentTitle }) => {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const [siteDataResult] = useDashboardSiteDataQuery({
    variables: {
      domainOrSubdomain: subdomain,
    },
    pause: !subdomain,
  })
  const links = [
    {
      href: `/dashboard/${subdomain}`,
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
      href: `/dashboard/${subdomain}/settings`,
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
      href: `/dashboard/${subdomain}/account`,
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
          <div className="">
            <SiteSwitcher subdomain={subdomain} />
          </div>

          <div className="px-3 mb-3">
            <a
              className="text-sm text-zinc-500 space-x-2 transition-colors hover:text-zinc-800 hover:bg-zinc-200 h-8 border rounded-lg flex justify-center items-center border-zinc-200"
              target={"_blank"}
              rel="noopener noreferrer"
              href={`http://${subdomain}.localhost:3000`}
            >
              <svg
                width="1em"
                height="1em"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              <span>View Site</span>
            </a>
          </div>

          <div className="px-3 space-y-[2px] text-zinc-500">
            {links.map((link) => {
              const active = router.asPath === link.href
              return (
                <Link href={link.href} key={link.href}>
                  <a
                    className={clsx(
                      `flex px-2 h-8 text-sm items-center rounded-lg`,
                      active
                        ? `bg-zinc-200 font-medium text-zinc-800`
                        : `hover:bg-zinc-200 hover:bg-opacity-50`,
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
        <Main width={mainWidth}>{children}</Main>
      </div>
    </>
  )
}
