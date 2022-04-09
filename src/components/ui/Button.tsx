import React from "react"
import clsx from "clsx"

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean
    isBlock?: boolean
    variant?: "primary" | "ghost"
  }
> = ({ type, children, className, isLoading, isBlock, variant, ...props }) => {
  return (
    <button
      {...props}
      type={type || "button"}
      className={clsx(
        className,
        "button",
        isLoading && "is-loading",
        isBlock && `is-block`,
        `is-${variant || "primary"}`,
      )}
    >
      {children}
    </button>
  )
}
