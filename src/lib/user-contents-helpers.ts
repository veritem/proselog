import { IS_PROD } from "$src/config"

export function getUserContentsUrl(filename: string): string
export function getUserContentsUrl(filename: undefined | null): undefined
export function getUserContentsUrl<T extends string | undefined | null>(
  filename: T,
): T
export function getUserContentsUrl(filename: string | undefined | null) {
  if (!filename) return undefined
  if (IS_PROD) {
    return `https://usercontents.${process.env.OUR_DOMAIN}/${filename}`
  }
  return `/dev-s3-proxy/${filename}`
}
