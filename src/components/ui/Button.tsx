import React from "react"
import clsx from "clsx"

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean
    isBlock?: boolean
    variant?: "primary" | "ghost"
    variantColor?: "green" | "red"
    size?: "small"
  }
> = ({
  type,
  children,
  className,
  isLoading,
  isBlock,
  variant,
  variantColor,
  size,
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
        variantColor && `is-${variantColor}`,
        size && `is-${size}`,
        `is-${variant || "primary"}`,
      )}
    >
      {children}
    </button>
  )
}
