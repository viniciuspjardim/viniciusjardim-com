'use server'

import { updateTag } from 'next/cache'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { env } from '~/env'

const CacheTagSchema = z.enum(['posts-list', 'categories-list'])
export type CacheTag = z.infer<typeof CacheTagSchema>

export async function updateCacheTag(tag: z.infer<typeof CacheTagSchema>) {
  const { userId } = await auth()
  const isSiteOwner = userId === env.SITE_OWNER_USER_ID

  if (!userId || !isSiteOwner) {
    throw new Error('Unauthorized')
  }

  if (!CacheTagSchema.safeParse(tag).success) {
    throw new Error('Invalid cache tag')
  }

  console.log('server-action.updateCacheTag', { tag })

  updateTag(tag)

  return { success: true }
}
