import { eq, asc, desc } from 'drizzle-orm'
import { idb, s } from '~/db/drizzle'
import { TRPCError } from '@trpc/server'

/** Get one category by slug */
export async function getOneBySlug(slug: string) {
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
  const flatCategories = await idb
    .select()
    .from(s.category)
    .orderBy(desc(s.category.rank), asc(s.category.createdAt))

  return flatCategories
}
