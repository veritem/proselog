import React from "react"
import { TabItem, Tabs } from "../ui/Tabs"
import { DashboardLayout } from "./DashboardLayout"

export type Props = {
  title: string
  children?: React.ReactNode
  tabItems: TabItem[]
}

export const SettingsLayout: React.FC<Props> = ({
  title,
  children,
  tabItems,
}) => {
  return (
    <DashboardLayout documentTitle={title}>
      <div className="">
        <header className="mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
        </header>
        <div>
          <Tabs items={tabItems} />
          <div className="max-w-screen-md">{children}</div>
        </div>
      </div>
    </DashboardLayout>
  )
}
