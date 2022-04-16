import {
  Site as DB_Site,
  Post as DB_Post,
  MembershipRole,
} from "@prisma/client"
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

  const isAdminOrGreater = (siteId?: string) => {
    if (!user || !siteId) return false
    const roles: MembershipRole[] = [MembershipRole.ADMIN, MembershipRole.OWNER]
    return user.memberships.some(
      (member) => member.siteId === siteId && roles.includes(member.role),
    )
  }

  const allow = {
    site: {
      read(site: Partial<DB_Site>) {
        return !site.deletedAt
      },
      update(site: Partial<DB_Site>) {
        return isAdminOrGreater(site.id) && !site.deletedAt
      },
      delete(site: Partial<DB_Site>) {
        return isAdminOrGreater(site.id)
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
          ? !post.deletedAt
          : !post.deletedAt && isAdminOrGreater(post.siteId)
      },
      update(site: Partial<DB_Site>) {
        return allow.site.update(site)
      },
      list(type: "public" | "all", site: Partial<DB_Site>) {
        if (type === "all") return !site.deletedAt && allow.post.create(site)
        return !site.deletedAt
      },
      delete(site: Partial<DB_Site>) {
        return allow.site.delete(site)
      },
    },
    user: {
      update(userToUpdate: { id: string; deletedAt: Date | null }) {
        return user && user.id === userToUpdate.id && !userToUpdate.deletedAt
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
