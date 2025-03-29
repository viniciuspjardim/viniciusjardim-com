import type { User } from '@clerk/nextjs/server'

export function filterUserFields(user: User) {
  return {
    id: user.id,
    userName: user.username,
    userImageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  }
}
