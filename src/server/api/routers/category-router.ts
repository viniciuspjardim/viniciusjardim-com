import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { db } from '~/db'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const categoryRouter = createTRPCRouter({
  getAllFlat: publicProcedure.query(async () => {
    const flatCategories = await db.category.getAll()

    return flatCategories
  }),

  getOneBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(200) }))
    .query(async ({ input }) => {
      const category = await db.category.getOneBySlug(input.slug)

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      return category
    }),
})
