import { User as DB_User } from "@prisma/client"

export const removeUserPrivateFields = (user: Partial<DB_User>) => {
  user.email = undefined
  user.emailVerified = undefined
  user.apiToken = undefined
}
