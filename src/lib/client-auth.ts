import { OUR_DOMAIN } from "$src/config"

export const clientLogout = () => {
  const url = new URL(`${location.protocol}//${OUR_DOMAIN}/logout`)
  if (location.host !== OUR_DOMAIN) {
    url.searchParams.set(
      "next",
      `${location.protocol}//${location.host}/logout`,
    )
  }
  location.href = url.href
}

export const getClientLoginNext = () => {
  return `${location.protocol}//${location.host}${location.pathname}`
}
