import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { Button } from "../ui/Button"
import { Sidebar, Main } from "./DashboardLayout"

export const SettingsLayout: React.FC<{
  title: string
  children?: React.ReactNode
}> = ({ title, children }) => {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const back = () => {
    router.push(`/dashboard/${subdomain}`)
  }

  const links = [
    {
      href: `/dashboard/${subdomain}/settings`,
      text: "Site",
    },
    {
      href: `/dashboard/${subdomain}/settings/account`,
      text: "Account",
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
          <div className="mt-3 space-y-1 text-sm font-medium text-zinc-700">
            {links.map((link) => {
              const active = router.asPath === link.href
              return (
                <Link key={link.text} href={link.href}>
                  <a
                    className={clsx(
                      `rounded-lg px-2 h-8 flex items-center`,
                      active ? `bg-zinc-100` : `hover:bg-zinc-50`,
                    )}
                  >
                    {link.text}
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      </Sidebar>
      <Main>
        <div className="max-w-screen-md mx-auto px-5 py-14">
          <h2 className="text-2xl border-b pb-5 mb-8">{title}</h2>
          <div className="">{children}</div>
        </div>
      </Main>
    </div>
  )
}
