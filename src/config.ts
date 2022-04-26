import { CookieSerializeOptions } from "cookie"

export const OUR_DOMAIN = process.env.OUR_DOMAIN
export const IS_PROD = process.env.NODE_ENV === "production"
export const AUTH_SECRET = process.env.AUTH_SECRET
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME
export const S3_REGION = process.env.S3_REGION
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME
export const S3_ENDPOINT = process.env.S3_ENDPOINT

export const AUTH_COOKIE_OPTIONS: CookieSerializeOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  // expires in 6 months
  expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
  secure: process.env.NODE_ENV === "production",
}
