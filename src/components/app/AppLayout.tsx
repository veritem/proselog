import { APP_NAME } from "$src/config"
import Link from "next/link"
import React from "react"

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <header className="border-b">
        <div className="container h-14 flex justify-between items-center">
          <h1 className="font-bold">
            <Link href="/">
              <a>{APP_NAME}</a>
            </Link>
          </h1>
        </div>
      </header>
      <div className="main py-8">
        <div className="container">{children}</div>
      </div>
    </>
  )
}
