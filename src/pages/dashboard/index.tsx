import { getAuthUser } from "$server/auth"
import { getUserLastActiveSite } from "$server/services/site.service"
import { redirect, serverSidePropsHandler } from "$src/lib/server-side-props"

export const getServerSideProps = serverSidePropsHandler(async (ctx) => {
  const user = await getAuthUser(ctx.req)
  if (!user) {
    return redirect("/login")
  }
  const site = await getUserLastActiveSite(user.id)
  if (!site) {
    return redirect(`/dashboard/new-site`)
  }
  return redirect(`/dashboard/${site.subdomain}`)
})

export default function DashboardIndex() {
  return <div>this text should not be visible</div>
}
