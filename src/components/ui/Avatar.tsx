import { useMemo } from "react"

export const Avatar: React.FC<{
  images: (string | null | undefined)[]
  name?: string | null
  size?: number
}> = ({ images, size, name }) => {
  size = size || 60

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

  return (
    <span
      className="inline-flex text-zinc-500 bg-white rounded-full items-center justify-center text-xl font-medium uppercase"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: image && `url(${image})`,
      }}
    >
      {nameAbbr}
    </span>
  )
}
