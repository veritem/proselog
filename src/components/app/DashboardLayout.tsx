import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"

export const DashboardLayout = () => {
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
        <div className="p-6">
          <Link href={`/dashboard/${subdomain}/new-post`}>
            <a className="h-9 font-medium bg-indigo-600 px-3 rounded-lg w-full justify-center inline-flex items-center text-white transform transition-transform hover:bg-indigo-700">
              New Post
            </a>
          </Link>
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
      <div className="ml-64">main</div>
    </div>
  )
}
