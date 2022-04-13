import React from "react"
import clsx from "clsx"

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean
    isBlock?: boolean
    variant?: "primary" | "ghost"
    color?: "green"
  }
> = ({
  type,
  children,
  className,
  isLoading,
  isBlock,
  variant,
  color,
  ...props
}) => {
  return (
    <button
      {...props}
      type={type || "button"}
      className={clsx(
        className,
        "button",
        isLoading && "is-loading",
        isBlock && `is-block`,
        color && `is-${color}`,
        `is-${variant || "primary"}`,
      )}
    >
      {children}
    </button>
  )
}
