import { revalidateTag } from 'next/cache'

import { z } from 'zod'
import { createTRPCRouter, ownerProcedure } from '~/server/api/trpc'

const CacheTagSchema = z.enum(['posts-list', 'categories-list'])
export type CacheTag = z.infer<typeof CacheTagSchema>

export const cacheRouter = createTRPCRouter({
  revalidateCacheTag: ownerProcedure
    .input(z.object({ tag: CacheTagSchema }))
    .mutation(async ({ input }) => {
      console.log('trpc.cacheRouter.revalidateCacheTag', { tag: input.tag })

      revalidateTag(input.tag, 'max')

      return { success: true }
    }),
})
