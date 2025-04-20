import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'

import { eq, asc, desc } from 'drizzle-orm'
import { idb, s } from '~/db/drizzle'
import { TRPCError } from '@trpc/server'

export const baseTag = 'category'

/** Get one category by slug */
export async function getOneBySlug(slug: string) {
  'use cache'
  cacheLife('weeks')
  cacheTag(baseTag)
  console.log('db.category.getOneBySlug')

  const [category] = await idb
    .select()
    .from(s.category)
    .where(eq(s.category.slug, slug))

  if (!category) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })
  }

  return category
}

/** Get all categories */
export async function getAll() {
  'use cache'
  cacheLife('weeks')
  cacheTag(baseTag)
  console.log('db.category.getAll')

  const flatCategories = await idb
    .select()
    .from(s.category)
    .orderBy(desc(s.category.rank), asc(s.category.createdAt))

  return flatCategories
}
