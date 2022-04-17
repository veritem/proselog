import clsx from "clsx"
import React, { useMemo } from "react"
import Image from "next/image"

export const Avatar: React.FC<
  {
    images: (string | null | undefined)[]
    name?: string | null
    size?: number
    bgColor?: string
  } & React.HTMLAttributes<HTMLSpanElement>
> = ({ images, size, name, bgColor, className, ...props }) => {
  size = size || 60

  const fontSize = size * 0.5

  const nameAbbr = (name || "")
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")

  const image = useMemo(() => {
    for (const image of images) {
      if (image) return image
    }
  }, [images])

  if (!image) {
    return (
      <span
        {...props}
        className={clsx(
          `inline-flex text-zinc-500 bg-white rounded-full items-center justify-center text-xl font-medium uppercase`,
          className,
        )}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${fontSize}px`,
          backgroundColor: bgColor && bgColor,
        }}
      >
        {nameAbbr}
      </span>
    )
  }
  console.log(image)
  return (
    <span
      {...props}
      className={clsx(
        `inline-flex text-zinc-500 bg-white rounded-full items-center justify-center text-xl font-medium uppercase`,
        className,
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Image
        className="rounded-full"
        src={image}
        width={size}
        height={size}
        alt={name || ""}
      />
    </span>
  )
}
