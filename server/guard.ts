import { Site as DB_Site, Post as DB_Post } from "@prisma/client"
import { ApolloError } from "apollo-server-core"
import { ContextType } from "./decorators"
import { AuthUser } from "./auth"

export const getGuard = <TRequireAuth extends boolean>(
  { user }: ContextType,
  { requireAuth }: { requireAuth?: TRequireAuth } = {},
) => {
  if (requireAuth && !user) {
    throw new ApolloError("login required")
  }

  const allow = {
    site: {
      read(site: Partial<DB_Site>) {
        return !!site.id
      },
      update(site: Partial<DB_Site>) {
        return user && site.userId === user.id
      },
      delete(site: Partial<DB_Site>) {
        return user && site.userId === user.id
      },
      list() {
        return true
      },
    },
    post: {
      create(site: Partial<DB_Site>) {
        return allow.site.update(site)
      },
      read(post: Partial<DB_Post>) {
        const isPublished =
          post.published && post.publishedAt && post.publishedAt <= new Date()
        return isPublished
          ? true
          : user?.sites.some((site) => site.id === post.siteId)
      },
      update(site: Partial<DB_Site>) {
        return allow.site.update(site)
      },
      list(type: "public" | "all", site: Partial<DB_Site>) {
        if (type === "all") return allow.post.create(site)
        return true
      },
      delete(site: Partial<DB_Site>) {
        return allow.site.delete(site)
      },
    },
    user: {
      update(payload: { userId: string }) {
        return user && user.id === payload.userId
      },
      isAuthUser(userId?: string) {
        return Boolean(userId && userId === user?.id)
      },
    },
    ANY(rules: (() => boolean | null | undefined)[]) {
      for (const rule of rules) {
        if (rule()) {
          return
        }
      }
      throw new ApolloError("permission denied")
    },
  }

  return {
    user: user as TRequireAuth extends true
      ? AuthUser
      : AuthUser | null | undefined,
    allow,
  }
}
