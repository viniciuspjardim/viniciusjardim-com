import { clerkClient } from '@clerk/nextjs/server'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { s } from '~/db'
import {
  createTRPCRouter,
  publicProcedure,
  ownerProcedure,
} from '~/server/api/trpc'
import { upload } from '~/server/uploadthing'
import { filterUserFields } from '~/helpers/user'
import { createSpeech as generateSpeech } from '~/helpers/open-ai'
import { addOrReplaceSpeechNode, getPostText } from '~/helpers/tiptap-utils'

export const postRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({ showUnpublished: z.boolean().optional().default(false) })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db
        .select()
        .from(s.post)
        .where(input?.showUnpublished ? undefined : eq(s.post.published, true))
        .orderBy(desc(s.post.rank), desc(s.post.writtenAt))

      const userList = await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
      })

      const users = userList.data.map(filterUserFields)

      return posts.map((post) => ({
        ...post,
        author: users.find((user) => user.id === post.authorId),
      }))
    }),

  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(s.post)
        .where(eq(s.post.id, input.id))

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
      }

      try {
        const user = await clerkClient.users.getUser(post.authorId)

        return { ...post, author: filterUserFields(user) }
      } catch (_error) {
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
      const [post] = await ctx.db
        .select()
        .from(s.post)
        .where(eq(s.post.slug, input.slug))

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
      }

      try {
        const user = await clerkClient.users.getUser(post.authorId)

        return { ...post, author: filterUserFields(user) }
      } catch (_error) {
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
        lang: z.string().min(1).max(20).optional(),
        writtenAt: z.date().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      return ctx.db.transaction(async (tx) => {
        const [post] = await tx
          .insert(s.post)
          .values({ ...input, authorId })
          .returning()

        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
        }

        await tx.insert(s.postLog).values({ ...post, logType: 'CREATE' })

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
        lang: z.string().min(1).max(20).optional(),
        writtenAt: z.date().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const [post] = await tx
          .update(s.post)
          .set({ ...input })
          .where(eq(s.post.id, input.id))
          .returning()

        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
        }

        await tx.insert(s.postLog).values({ ...post, logType: 'UPDATE' })

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
      return ctx.db.transaction(async (tx) => {
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

        const content = z.string().min(1).max(4096).parse(postText)
        const speechBuffer = await generateSpeech(content)
        const [utFile] = await upload(speechBuffer, input.slug)

        const speechFileUrl = utFile?.data?.ufsUrl

        if (!speechFileUrl) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to upload speech file',
          })
        }

        const contentWithSpeech = addOrReplaceSpeechNode(
          post.content,
          speechFileUrl
        )

        const [updatedPost] = await tx
          .update(s.post)
          .set({ ...post, content: contentWithSpeech })
          .where(eq(s.post.id, post.id))
          .returning()

        if (!updatedPost) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
        }

        await tx.insert(s.postLog).values({ ...updatedPost, logType: 'UPDATE' })

        return { success: true }
      })
    }),

  remove: ownerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const [post] = await tx
          .delete(s.post)
          .where(eq(s.post.id, input.id))
          .returning()

        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
        }

        await tx.insert(s.postLog).values({ ...post, logType: 'DELETE' })

        return post
      })
    }),
})
