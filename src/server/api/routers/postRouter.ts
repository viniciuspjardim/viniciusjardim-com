import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { privateProcedure } from './../trpc'

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({ orderBy: { writtenAt: 'desc' } })
  }),

  create: privateProcedure
    .input(
      z.object({
        title: z.string().min(1).max(120),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const post = await ctx.prisma.post.create({
        data: { ...input, authorId },
      })

      return post
    }),
})
