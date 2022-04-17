export const IS_PROD = process.env.NODE_ENV === "production"
export const AUTH_SECRET = process.env.AUTH_SECRET
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME
export const API_ENDPOINT = IS_PROD ? `https://${process.env.OUR_DOMAIN}` : ``
