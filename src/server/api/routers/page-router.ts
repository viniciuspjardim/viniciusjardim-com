import { clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { db } from '~/db'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { filterUserFields } from '~/helpers/user'

export const pageRouter = createTRPCRouter({
  getAllPostsByCategorySlug: publicProcedure
    .input(z.object({ categorySlug: z.string().min(1).max(200).optional() }))
    .query(async ({ input }) => {
      // Get slug category or null
      const category = input.categorySlug
        ? await db.category.getOneBySlug(input.categorySlug)
        : null

      // If category slug is provided, but not found, throw an error
      if (input.categorySlug && !category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      const posts = await db.post.getAllFromCategory(input.categorySlug)

      const clerk = await clerkClient()
      const userList = await clerk.users.getUserList({
        userId: posts.map((post) => post.authorId),
      })

      const users = userList.data.map(filterUserFields)

      const postsWithAuthor = posts.map((post) => ({
        ...post,
        author: users.find((user) => user.id === post.authorId),
      }))

      return postsWithAuthor
    }),
})
