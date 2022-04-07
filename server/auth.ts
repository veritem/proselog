import hkdf from "@panva/hkdf"
import { EncryptJWT, jwtDecrypt } from "jose"
import { prisma } from "./prisma"
import { IncomingMessage, ServerResponse } from "http"
import { singletonAsync } from "./singleton"
import { AUTH_COOKIE_NAME, AUTH_SECRET } from "$src/config"
import { nanoid } from "nanoid"
import Cookie from "cookie"
import { verifyJWT } from "./jwt"

export type AuthUser = {
  id: string
  name: string
  email: string
  sites: {
    id: string
    name: string
    subdomain: string
  }[]
}

export const getAuthUser = async (
  req: IncomingMessage,
): Promise<AuthUser | null> => {
  let token = req.headers["authorization"]?.replace(/[Bb]earer\s/, "")
  if (!token && req.headers.cookie) {
    token = Cookie.parse(req.headers.cookie)[process.env.AUTH_COOKIE_NAME]
  }
  if (token) {
    const payload = await verifyJWT(token)
    if (!payload) return null

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      include: {
        sites: {
          select: {
            id: true,
            name: true,
            subdomain: true,
          },
        },
      },
    })
    if (!user) return null
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      sites: user.sites,
    }
  }
  return null
}

export const setAuthCookie = (res: ServerResponse, token: string) => {
  const value = Cookie.serialize(AUTH_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === "production",
  })
  res.setHeader("set-cookie", value)
}

export const getDerivedKey = (secret: string) =>
  hkdf("sha256", secret, "", "Generated Encryption Key", 32)

export const AUTH_ENCRYPTION_KEY = singletonAsync("auth_encryption_key", () =>
  getDerivedKey(AUTH_SECRET),
)

export const encrypt = async (payload: any, exp: string) => {
  await AUTH_ENCRYPTION_KEY.wait
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .setJti(nanoid())
    .encrypt(AUTH_ENCRYPTION_KEY.value)
}

export const decrypt = async (token: string) => {
  await AUTH_ENCRYPTION_KEY.wait
  const { payload } = await jwtDecrypt(token, AUTH_ENCRYPTION_KEY.value, {
    clockTolerance: 15,
  })
  return payload
}
