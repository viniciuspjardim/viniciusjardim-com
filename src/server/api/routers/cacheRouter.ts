import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter } from '~/server/api/trpc'
import { privateProcedure } from '~/server/api/trpc'

export const cacheRouter = createTRPCRouter({
  clearCache: privateProcedure
    .input(z.object({ route: z.string().min(1).max(200) }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.res.revalidate(input.route)

        return { revalidated: true, route: input.route }
      } catch (error) {
        console.error('clearCache error:', error)

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Not able to clear the cache for this route',
        })
      }
    }),
})
