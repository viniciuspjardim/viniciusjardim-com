import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { privateProcedure } from './../trpc'
import { clerkClient } from '@clerk/nextjs/server'
import type { User } from '@clerk/nextjs/dist/api'
import { TRPCError } from '@trpc/server'

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

  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
      })

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
      }

      return post
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

  update: privateProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(120),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.update({
        where: { id: input.id },
        data: { title: input.title, content: input.content },
      })

      return post
    }),

  remove: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.delete({
        where: { id: input.id },
      })

      return post
    }),
})
