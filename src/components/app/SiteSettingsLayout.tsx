import { useRouter } from "next/router"
import React from "react"
import { TabItem } from "../ui/Tabs"
import { SettingsLayout, Props } from "./_SettingsLayout"

export const SiteSettingsLayout: React.FC<
  Omit<Props, "tabItems" | "title"> & { subdomain?: string }
> = ({ subdomain, ...props }) => {
  const router = useRouter()
  const tabItems: TabItem[] = [
    { text: "General", href: `/dashboard/${subdomain}/settings/general` },
    { text: "Domains", href: `/dashboard/${subdomain}/settings/domains` },
  ].map((item) => ({ ...item, active: router.asPath === item.href }))
  return <SettingsLayout {...props} title="Site Settings" tabItems={tabItems} />
}
