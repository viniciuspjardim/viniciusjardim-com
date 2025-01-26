import type { User } from '@clerk/nextjs/api'
import { clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import {
  createTRPCRouter,
  publicProcedure,
  ownerProcedure,
} from '~/server/api/trpc'

function filterUserFields(user: User) {
  return {
    id: user.id,
    userName: user.username,
    userImageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  }
}

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: [{ rank: 'desc' }, { writtenAt: 'desc' }],
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

  // TODO: move this to it's own router like `categoryPageRouter`
  getAllByCategorySlug: publicProcedure
    .input(z.object({ categorySlug: z.string().min(1).max(200).optional() }))
    .query(async ({ ctx, input }) => {
      // Get all categories
      const flatCategories = await ctx.db.category.findMany({
        orderBy: [{ rank: 'desc' }, { createdAt: 'asc' }],
      })

      // Get category by slug
      const category = input.categorySlug
        ? flatCategories.find(
            (category) => category.slug === input.categorySlug
          )
        : null

      // If category slug is provided, but not found, throw an error
      if (input.categorySlug && !category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      // Get all posts or posts by the category
      // TODO: get post also from subcategories when the category is provided
      const posts = await ctx.db.post.findMany({
        where: { categoryId: category?.id },
        orderBy: [{ rank: 'desc' }, { writtenAt: 'desc' }],
      })

      const users = (
        await clerkClient.users.getUserList({
          userId: posts.map((post) => post.authorId),
        })
      ).map(filterUserFields)

      const postsWithAuthor = posts.map((post) => ({
        ...post,
        author: users.find((user) => user.id === post.authorId),
      }))

      return { categories: flatCategories, posts: postsWithAuthor }
    }),

  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      })

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
      }

      try {
        const user = await clerkClient.users.getUser(post.authorId)

        return { ...post, author: filterUserFields(user) }
      } catch (error) {
        return {
          ...post,
          author: {
            id: post.authorId,
            userName: null,
            userImageUrl: null,
            firstName: null,
            lastName: null,
          },
        }
      }
    }),

  getOneBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(200) }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { slug: input.slug },
      })

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
      }

      try {
        const user = await clerkClient.users.getUser(post.authorId)

        return { ...post, author: filterUserFields(user) }
      } catch (error) {
        return {
          ...post,
          author: {
            id: post.authorId,
            userName: null,
            userImageUrl: null,
            firstName: null,
            lastName: null,
          },
        }
      }
    }),

  create: ownerProcedure
    .input(
      z.object({
        slug: z.string().min(1).max(200),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(200).optional(),
        keywords: z.string().min(1).max(200).optional(),
        content: z.string().min(1),
        rank: z.number().optional(),
        categoryId: z.number(),
        writtenAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      return ctx.db.$transaction(async (tx) => {
        const post = await tx.post.create({
          data: { ...input, authorId },
        })

        await tx.postLog.create({
          data: {
            ...post,
            logType: 'CREATE',
          },
        })

        return post
      })
    }),

  update: ownerProcedure
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).max(200),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(200).optional(),
        keywords: z.string().min(1).max(200).optional(),
        content: z.string().min(1),
        rank: z.number().optional(),
        categoryId: z.number(),
        writtenAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const post = await ctx.db.post.update({
          where: { id: input.id },
          data: { ...input },
        })

        await tx.postLog.create({
          data: {
            ...post,
            logType: 'UPDATE',
          },
        })

        return post
      })
    }),

  remove: ownerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const post = await ctx.db.post.delete({
          where: { id: input.id },
        })

        await tx.postLog.create({
          data: {
            ...post,
            logType: 'DELETE',
          },
        })

        return post
      })
    }),
})
