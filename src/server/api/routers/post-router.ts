import type { JSONContent } from '@tiptap/core'

import { revalidateTag } from 'next/cache'

import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { db, s } from '~/db'
import {
  createTRPCRouter,
  publicProcedure,
  ownerProcedure,
} from '~/server/api/trpc'
import { uploadSpeech } from '~/server/uploadthing'
import { generateSpeech } from '~/helpers/open-ai'
import { addOrReplaceSpeechNode, getPostText } from '~/helpers/tiptap-utils'

const JSONContentSchema: z.ZodType<JSONContent> = z.lazy(() =>
  z
    .object({
      type: z.string().optional(),
      attrs: z.record(z.string(), z.any()).optional(),
      content: z.array(JSONContentSchema).optional(),
      marks: z
        .array(
          z
            .object({
              type: z.string(),
              attrs: z.record(z.string(), z.any()).optional(),
            })
            .catchall(z.any())
        )
        .optional(),
      text: z.string().optional(),
    })
    .catchall(z.any())
)

export const postRouter = createTRPCRouter({
  getOneById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await db.post.getOneById(input.id)

      return post
    }),

  getOneBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(200) }))
    .query(async ({ input }) => {
      const post = await db.post.getOneBySlug(input.slug)

      return post
    }),

  getAll: publicProcedure
    .input(z.object({ showUnpublished: z.boolean() }).optional())
    .query(async ({ input }) => {
      const posts = await db.post.getAll(input?.showUnpublished)

      return posts
    }),

  getAllByCategorySlug: publicProcedure
    .input(z.object({ categorySlug: z.string().min(1).max(200).optional() }))
    .query(async ({ input }) => {
      const posts = await db.post.getAllByCategorySlug(input.categorySlug)

      return posts
    }),

  // TODO: move mutations below to db.post.*

  create: ownerProcedure
    .input(
      z.object({
        slug: z.string().min(1).max(200),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(200).optional(),
        keywords: z.string().min(1).max(200).optional(),
        content: JSONContentSchema,
        rank: z.number().optional(),
        categoryId: z.number(),
        lang: z.string().min(1).max(20).optional(),
        writtenAt: z.date().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      return ctx.idb.transaction(async (tx) => {
        const [post] = await tx
          .insert(s.post)
          .values({ ...input, authorId })
          .returning()

        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
        }

        await tx.insert(s.postLog).values({ ...post, logType: 'CREATE' })

        revalidateTag(db.post.baseTag, 'max')

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
        content: JSONContentSchema,
        rank: z.number().optional(),
        categoryId: z.number(),
        lang: z.string().min(1).max(20).optional(),
        writtenAt: z.date().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.idb.transaction(async (tx) => {
        const [post] = await tx
          .update(s.post)
          .set({ ...input })
          .where(eq(s.post.id, input.id))
          .returning()

        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
        }

        await tx.insert(s.postLog).values({ ...post, logType: 'UPDATE' })

        revalidateTag(db.post.baseTag, 'max')

        return post
      })
    }),

  generateSpeech: ownerProcedure
    .input(
      z.object({
        slug: z.string().min(1).max(200),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.idb.transaction(async (tx) => {
        const [post] = await tx
          .select()
          .from(s.post)
          .where(eq(s.post.slug, input.slug))

        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
        }

        const postText = getPostText(post.content, {
          title: post.title,
          description: post.description,
          titlesSeparator: '.\n\n',
        })

        const content = z.string().min(1).parse(postText)
        const speechBuffer = await generateSpeech(content, post.lang)
        const [utFile] = await uploadSpeech(speechBuffer, input.slug)

        const speechFileUrl = utFile?.data?.ufsUrl

        if (!speechFileUrl) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to upload speech file',
          })
        }

        // Note: this mutates the `post.content` object
        addOrReplaceSpeechNode(post.content, speechFileUrl)

        const [updatedPost] = await tx
          .update(s.post)
          .set(post)
          .where(eq(s.post.id, post.id))
          .returning()

        if (!updatedPost) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
        }

        await tx.insert(s.postLog).values({ ...updatedPost, logType: 'UPDATE' })

        revalidateTag(db.post.baseTag, 'max')

        return { success: true }
      })
    }),

  remove: ownerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.idb.transaction(async (tx) => {
        const [post] = await tx
          .delete(s.post)
          .where(eq(s.post.id, input.id))
          .returning()

        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
        }

        await tx.insert(s.postLog).values({ ...post, logType: 'DELETE' })

        revalidateTag(db.post.baseTag, 'max')

        return post
      })
    }),

  revalidateCacheTag: ownerProcedure.mutation(async () => {
    console.log('trpc.postRouter.revalidateCacheTag')

    revalidateTag(db.post.baseTag, 'max')
    return { success: true }
  }),
})
