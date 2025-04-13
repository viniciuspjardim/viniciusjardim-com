import { eq, asc, desc } from 'drizzle-orm'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { s } from '~/db'
import {
  createTRPCRouter,
  publicProcedure,
  ownerProcedure,
} from '~/server/api/trpc'
import { assembleCategories } from '~/helpers/assemble-categories'

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const flatCategories = await ctx.idb
      .select()
      .from(s.category)
      .orderBy(desc(s.category.rank), asc(s.category.createdAt))

    const { rootCategories: categories } = assembleCategories(flatCategories)

    return categories
  }),

  getAllFlat: publicProcedure.query(async ({ ctx }) => {
    const flatCategories = await ctx.idb
      .select()
      .from(s.category)
      .orderBy(desc(s.category.rank), asc(s.category.createdAt))

    return flatCategories
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.idb
        .select()
        .from(s.category)
        .where(eq(s.category.id, input.id))

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      return category
    }),

  getOneBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(200) }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.idb
        .select()
        .from(s.category)
        .where(eq(s.category.slug, input.slug))

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      return category
    }),

  create: ownerProcedure
    .input(
      z.object({
        slug: z.string().min(1).max(200),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(200).optional(),
        keywords: z.string().min(1).max(200).optional(),
        rank: z.number().optional(),
        parentId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.idb
        .insert(s.category)
        .values({ ...input })
        .returning()

      return category
    }),

  update: ownerProcedure
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).max(200),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(200).optional(),
        keywords: z.string().min(1).max(200).optional(),
        rank: z.number().optional(),
        parentId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.idb
        .update(s.category)
        .set({ ...input })
        .where(eq(s.category.id, input.id))
        .returning()

      return category
    }),

  remove: ownerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.idb
        .delete(s.category)
        .where(eq(s.category.id, input.id))
        .returning()

      return category
    }),
})
