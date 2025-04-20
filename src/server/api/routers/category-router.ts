import { revalidateTag } from 'next/cache'

import { z } from 'zod'
import { db } from '~/db'
import {
  createTRPCRouter,
  publicProcedure,
  ownerProcedure,
} from '~/server/api/trpc'

export const categoryRouter = createTRPCRouter({
  getOneBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(200) }))
    .query(async ({ input }) => {
      const category = await db.category.getOneBySlug(input.slug)

      return category
    }),

  getAll: publicProcedure.query(async () => {
    const categories = await db.category.getAll()

    return categories
  }),

  revalidateCacheTag: ownerProcedure.mutation(async () => {
    console.log('trpc.categoryRouter.revalidateCacheTag')

    revalidateTag(db.category.baseTag)
    return { success: true }
  }),
})
