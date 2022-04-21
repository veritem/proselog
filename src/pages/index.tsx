import { getAuthUser } from "$server/auth"
import { clientState } from "$src/lib/client-state"
import { serverSidePropsHandler } from "$src/lib/server-side-props"
import Link from "next/link"

type Props = {
  isLoggedIn: boolean
}

export const getServerSideProps = serverSidePropsHandler<Props>(async (ctx) => {
  const user = await getAuthUser(ctx.req)
  return { props: { isLoggedIn: !!user } }
})

export default function Page({ isLoggedIn }: Props) {
  const links: Array<{ text: string; href?: string; onClick?: () => void }> =
    isLoggedIn
      ? [
          {
            text: "Dashboard",
            href: "/dashboard",
          },
          {
            text: "Log out",
            href: "/logout",
          },
        ]
      : [
          {
            text: "Log in",
            onClick() {
              clientState.loginModalOpened = true
            },
          },
        ]
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <div className="-mt-20">
          <div className="max-w-screen-md mx-auto px-5">
            <div>
              <span className="inline-block text-3xl lg:text-7xl px-3 rounded-lg py-2 font-bold bg-indigo-600 text-white">
                Typelog
              </span>
            </div>
            <div className="italic text-zinc-500 text-sm mt-1">
              ..is under beta testing
            </div>
            <div className="space-x-5 mt-10">
              {links.map((link) => {
                if (link.href) {
                  return (
                    <Link href={link.href} key={link.href}>
                      <a className="font-bold nav-link underline">
                        {link.text}
                      </a>
                    </Link>
                  )
                }
                return (
                  <button
                    type="button"
                    className="font-bold nav-link underline"
                    onClick={link.onClick}
                    key={link.href}
                  >
                    {link.text}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
