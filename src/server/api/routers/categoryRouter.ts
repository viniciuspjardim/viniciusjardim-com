import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from '~/server/api/trpc'

import { assembleCategories } from '~/helpers/assembleCategories'

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const flatCategories = await ctx.prisma.category.findMany({
      include: { posts: { select: { title: true, slug: true } } },
      orderBy: [{ rank: 'desc' }, { createdAt: 'asc' }],
    })

    const { rootCategories: categories } = assembleCategories(
      flatCategories.map((category) => ({ ...category, subcategories: [] }))
    )

    return categories
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUnique({
        where: { id: input.id },
      })

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
      const category = await ctx.prisma.category.findUnique({
        where: { slug: input.slug },
      })

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      return category
    }),

  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        slug: z.string().min(1).max(200),
        rank: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.create({
        data: { ...input },
      })

      return category
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(200),
        slug: z.string().min(1).max(200),
        rank: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.update({
        where: { id: input.id },
        data: { ...input },
      })

      return category
    }),

  remove: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.delete({
        where: { id: input.id },
      })

      return category
    }),
})
