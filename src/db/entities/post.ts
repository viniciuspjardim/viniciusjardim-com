import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'

import type { JSONContent } from '@tiptap/core'

import { clerkClient } from '@clerk/nextjs/server'
import { sql, eq, desc } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { idb, s } from '~/db/drizzle'
import { filterUserFields } from '~/helpers/user'

export const baseTag = 'post'

const JSONContentSchema: z.ZodType<JSONContent> = z.lazy(() =>
  z
    .object({
      type: z.string().optional(),
      attrs: z.record(z.any()).optional(),
      content: z.array(JSONContentSchema).optional(),
      marks: z
        .array(
          z
            .object({
              type: z.string(),
              attrs: z.record(z.any()).optional(),
            })
            .catchall(z.any())
        )
        .optional(),
      text: z.string().optional(),
    })
    .catchall(z.any())
)

async function postWithAuthor(post: s.Post) {
  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(post.authorId)

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
}

async function postsWithAuthor(posts: s.Post[]) {
  const clerk = await clerkClient()
  const userList = await clerk.users.getUserList({
    userId: posts.map((post) => post.authorId),
  })

  const users = userList.data.map(filterUserFields)

  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.authorId),
  }))
}

/** Get one post by slug */
export async function getOneBySlug(slug: string) {
  'use cache'
  cacheLife('weeks')
  cacheTag(baseTag)
  console.log('db.post.getOneBySlug')

  const [post] = await idb.select().from(s.post).where(eq(s.post.slug, slug))

  if (!post) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
  }

  return await postWithAuthor(post)
}

/** Get all posts */
export async function getAll(showUnpublished = false) {
  'use cache'
  cacheLife('weeks')
  cacheTag(baseTag)
  console.log('db.post.getAll')

  const posts = await idb
    .select()
    .from(s.post)
    .where(showUnpublished ? undefined : eq(s.post.published, true))
    .orderBy(desc(s.post.rank), desc(s.post.writtenAt))

  return await postsWithAuthor(posts)
}

/**
 * Get all posts from a category, including posts from subcategories
 *
 * If categorySlug is not provided, it will return all posts.
 *
 * @param categorySlug - The slug of the category to get posts from.
 * @returns An array of posts.
 */
export async function getAllByCategorySlug(categorySlug?: string) {
  'use cache'
  cacheLife('weeks')
  cacheTag(baseTag)
  console.log('db.post.getAllByCategorySlug')

  const slug = categorySlug ?? '<all>'

  const { rows: posts } = await idb.execute<s.Post>(
    sql`
      WITH RECURSIVE cTree AS (
        SELECT ${s.category.id}
        FROM ${s.category}
        WHERE ${s.category.slug} = ${slug} OR ${slug} = '<all>'
        
        UNION ALL
        
        SELECT ${s.category.id}
        FROM ${s.category}
        INNER JOIN cTree ON ${s.category.parentId} = cTree.id
      )
      SELECT ${s.post}.*
      FROM ${s.post}
      WHERE ${s.post.published} = TRUE and ${s.post.categoryId} IN (SELECT id FROM cTree)
      ORDER BY ${s.post.rank} DESC, ${s.post.writtenAt} DESC
    `
  )

  return await postsWithAuthor(posts)
}
