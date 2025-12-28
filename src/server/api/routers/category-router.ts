import { z } from 'zod'
import { db } from '~/db'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

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
})
