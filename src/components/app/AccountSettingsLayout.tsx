import { useRouter } from "next/router"
import React from "react"
import { TabItem } from "../ui/Tabs"
import { SettingsLayout, Props } from "./_SettingsLayout"

export const AccountSettingsLayout: React.FC<
  Omit<Props, "tabItems" | "title"> & { subdomain?: string }
> = ({ subdomain, ...props }) => {
  const router = useRouter()
  const tabItems: TabItem[] = [
    { text: "Profile", href: `/dashboard/${subdomain}/account/profile` },
  ].map((item) => ({ ...item, active: router.asPath === item.href }))
  return <SettingsLayout {...props} title="Account" tabItems={tabItems} />
}
