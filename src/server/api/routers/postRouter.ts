import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { privateProcedure } from './../trpc'
import { clerkClient } from '@clerk/nextjs/server'
import type { User } from '@clerk/nextjs/dist/api'

function filterUserFields(user: User) {
  return {
    id: user.id,
    userName: user.username,
    userImageUrl: user.profileImageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  }
}

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: { writtenAt: 'desc' },
    })

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
      })
    ).map(filterUserFields)

    return posts.map((post) => ({
      ...post,
      author: users.find((user) => user.id === post.authorId),
    }))
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
