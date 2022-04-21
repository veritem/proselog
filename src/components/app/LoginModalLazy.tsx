import dynamic from "next/dynamic"

export const LoginModalLazy = dynamic(() => import("./LoginModal"), {
  ssr: false,
})
