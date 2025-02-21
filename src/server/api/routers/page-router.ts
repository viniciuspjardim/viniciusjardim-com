import { sql, asc, desc } from 'drizzle-orm'
import { clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { s } from '~/db'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { filterUserFields } from '~/helpers/user'

type SelectPost = typeof s.post.$inferSelect

export const pageRouter = createTRPCRouter({
  getAllPostsByCategorySlug: publicProcedure
    .input(z.object({ categorySlug: z.string().min(1).max(200).optional() }))
    .query(async ({ ctx, input }) => {
      // Get all categories
      const flatCategories = await ctx.db
        .select()
        .from(s.category)
        .orderBy(desc(s.category.rank), asc(s.category.createdAt))

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

      // When category slug is not provided get all posts
      const slug = input.categorySlug ?? '<all>'

      const { rows: posts } = await ctx.db.execute<SelectPost>(
        sql`
          WITH RECURSIVE categoryTree AS (
            SELECT id
            FROM category
            WHERE slug = ${slug} OR ${slug} = '<all>'
            
            UNION ALL
            
            SELECT c.id
            FROM category c
            INNER JOIN categoryTree ct ON c."parentId" = ct.id
          )
          SELECT p.*
          FROM post p
          WHERE p."categoryId" IN (SELECT id FROM categoryTree)
          ORDER BY p.rank DESC, p."writtenAt" DESC
        `
      )

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
