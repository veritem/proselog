import React from "react"

export const SettingsLayout: React.FC<{
  title: string
  subtitle?: string
  children?: React.ReactNode
}> = ({ title, subtitle, children }) => {
  return (
    <div className="p-8 pt-5">
      <header className="border-b pb-2 mb-8">
        <h2 className="text-xl">{title}</h2>
        {subtitle && <h3 className="mt-1 text-zinc-500 text-sm">{subtitle}</h3>}
      </header>
      <div className="">{children}</div>
    </div>
  )
}
