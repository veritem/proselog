import Link from "next/link"
import { useRouter } from "next/router"

export const DashboardLayout = () => {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const links = [
    {
      href: `/dashboard/${subdomain}/posts`,
      text: "Posts",
    },
    {
      href: "/dashboard/[subdomain]/settings",
      text: "Settings",
    },
  ]

  return (
    <div className="bg-zinc-100 min-h-screen flex">
      <div className="w-64 bg-white fixed top-0 bottom-0 left-0">
        <div className="p-6">
          <Link href={`/dashboard/${subdomain}/new-post`}>
            <a className="h-10 font-medium bg-indigo-500 px-3 rounded-lg w-full justify-center inline-flex items-center text-white transform transition-transform hover:bg-indigo-600 focus:scale-105">
              New Post
            </a>
          </Link>
        </div>
        {links.map((link) => {
          return (
            <Link href={link.href} key={link.href}>
              <a className="flex px-6 h-10 items-center hover:bg-zinc-50">
                {link.text}
              </a>
            </Link>
          )
        })}
      </div>
      <div className="ml-64">main</div>
    </div>
  )
}
