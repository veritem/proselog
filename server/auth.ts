import hkdf from "@panva/hkdf"
import { EncryptJWT, jwtDecrypt } from "jose"
import { prisma } from "./prisma"
import { IncomingMessage, ServerResponse } from "http"
import { singletonAsync } from "./singleton"
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  AUTH_SECRET,
} from "$src/config"
import { nanoid } from "nanoid"
import Cookie from "cookie"
import type { Membership, User } from "@prisma/client"

export type AuthUser = User & {
  memberships: Membership[]
}

const findUserFromToken = async (token: string) => {
  const accessToken = await prisma.accessToken.findUnique({
    where: {
      token,
    },
    include: {
      user: {
        include: {
          memberships: true,
        },
      },
    },
  })

  return accessToken?.user
}

export const getAuthTokenFromRequest = (req: IncomingMessage) => {
  let token = req.headers["authorization"]?.replace(/[Bb]earer\s/, "")
  if (!token && req.headers.cookie) {
    token = Cookie.parse(req.headers.cookie)[process.env.AUTH_COOKIE_NAME]
  }
  return token
}

export const getAuthUser = async (
  req: IncomingMessage,
): Promise<AuthUser | null> => {
  const token = getAuthTokenFromRequest(req)

  if (token) {
    const user = await findUserFromToken(token)

    if (user) {
      return user
    }
  }

  return null
}

export const setAuthCookie = (
  res: ServerResponse,
  domain: string,
  token: string,
) => {
  const value = Cookie.serialize(
    AUTH_COOKIE_NAME,
    token,
    getAuthCookieOptions({ domain }),
  )
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
