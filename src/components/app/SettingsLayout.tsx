import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { Button } from "../ui/Button"
import { Sidebar, Main } from "./DashboardLayout"

export const SettingsLayout: React.FC<{
  title: string
  subtitle?: string
  children?: React.ReactNode
}> = ({ title, subtitle, children }) => {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const back = () => {
    router.push(`/dashboard/${subdomain}`)
  }

  const links = [
    {
      text: "Site",
      icon: (
        <svg width="1em" height="1em" viewBox="0 0 32 32">
          <path
            fill="currentColor"
            d="M16 17v8H6v-8h10m0-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm11-9v5H17V6h10m0-2H17a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 13v5h-5v-5h5m0-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2zM11 6v5H6V6h5m0-2H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
          ></path>
        </svg>
      ),
      children: [
        {
          text: "General",
          href: `/dashboard/${subdomain}/settings`,
        },
      ],
    },
    {
      text: "Account",
      icon: (
        <svg width="1em" height="1em" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08c1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"
          ></path>
        </svg>
      ),
      children: [
        {
          text: "Profile",
          href: `/dashboard/${subdomain}/settings/account/profile`,
        },
      ],
    },
  ]

  return (
    <div>
      <Sidebar>
        <div className="p-3">
          <button className="flex items-center space-x-2" onClick={back}>
            <svg
              className="w-5 h-5 text-zinc-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="">Dashbord</span>
          </button>
          <div className="mt-5 space-y-5 text-sm font-medium text-zinc-700">
            {links.map((item) => {
              return (
                <div key={item.text}>
                  <h4 className="flex space-x-2 items-center ">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-zinc-500">{item.text}</span>
                  </h4>
                  <div className="mt-2 pl-4">
                    {item.children.map((child) => {
                      const active = router.asPath === child.href
                      return (
                        <Link key={child.text} href={child.href}>
                          <a
                            className={clsx(
                              `rounded-lg px-2 h-7 flex items-center`,
                              active ? `bg-zinc-100` : `hover:bg-zinc-50`,
                            )}
                          >
                            {child.text}
                          </a>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Sidebar>
      <Main>
        <div className="max-w-screen-md mx-auto px-5 py-14">
          <header className="border-b pb-5 mb-8">
            <h2 className="text-2xl">{title}</h2>
            {subtitle && (
              <h3 className="mt-1 text-zinc-500 text-sm">{subtitle}</h3>
            )}
          </header>
          <div className="">{children}</div>
        </div>
      </Main>
    </div>
  )
}
