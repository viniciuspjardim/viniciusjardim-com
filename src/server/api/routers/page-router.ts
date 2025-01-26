import { clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { filterUserFields } from '~/helpers/user'

export const pageRouter = createTRPCRouter({
  getAllPostsByCategorySlug: publicProcedure
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
})
