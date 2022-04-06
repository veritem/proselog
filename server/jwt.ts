import { decrypt, encrypt } from "./auth"

type AUTH_COOKIE_PAYLOAD = {
  userId: string
}

export function getJWT(payload: AUTH_COOKIE_PAYLOAD) {
  return encrypt(payload, "30d")
}

export async function verifyJWT(
  token: string,
): Promise<AUTH_COOKIE_PAYLOAD | null> {
  try {
    const payload = await decrypt(token)
    return payload as AUTH_COOKIE_PAYLOAD
  } catch (error) {
    console.error(error)
    return null
  }
}
