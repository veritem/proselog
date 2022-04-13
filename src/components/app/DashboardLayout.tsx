import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

export const DashboardLayout: React.FC = ({ children }) => {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const links = [
    {
      href: `/dashboard/${subdomain}`,
      icon: "🎛️",
      text: "Dashboard",
    },
    {
      href: `/dashboard/${subdomain}/posts`,
      icon: "📝",
      text: "Posts",
    },
    {
      href: `/dashboard/${subdomain}/settings`,
      icon: "⚙️",
      text: "Settings",
    },
  ]

  return (
    <div className="flex">
      <div className="w-64 bg-white fixed top-0 bottom-0 left-0 border-r">
        <div className="p-6 flex space-x-3 items-center">
          <Link href={`/dashboard/${subdomain}/new-post`}>
            <a className="h-8 font-medium bg-indigo-500 shadow-sm px-2 rounded-lg w-full justify-center inline-flex items-center text-white transform transition-transform hover:bg-indigo-700">
              New Post
            </a>
          </Link>
          <button
            type="button"
            className="flex-shrink-0 w-8 h-8 border text-zinc-500 hover:bg-zinc-50 rounded-lg shadow-sm inline-flex items-center justify-center"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 space-y-1">
          {links.map((link) => {
            console.log(router.asPath, link.href)
            const active = router.asPath === link.href
            return (
              <Link href={link.href} key={link.href}>
                <a
                  className={clsx(
                    `flex px-2 h-9 items-center rounded-lg`,
                    active ? `bg-zinc-100` : `hover:bg-zinc-50`,
                  )}
                >
                  <span className="mr-2">{link.icon}</span>
                  <span>{link.text}</span>
                </a>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="ml-64 w-full">{children}</div>
    </div>
  )
}
