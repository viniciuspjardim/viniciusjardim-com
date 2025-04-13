import { sql } from 'drizzle-orm'
import { idb, type s } from '~/db/drizzle'

/**
 * Get all posts from a category, including posts from subcategories
 *
 * If categorySlug is not provided, it will return all posts.
 *
 * @param categorySlug - The slug of the category to get posts from.
 * @returns An array of posts.
 */
export async function getAllFromCategory(categorySlug?: string) {
  const slug = categorySlug ?? '<all>'

  const { rows: posts } = await idb.execute<s.Post>(
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
      WHERE p.published = TRUE and p."categoryId" IN (SELECT id FROM categoryTree)
      ORDER BY p.rank DESC, p."writtenAt" DESC
    `
  )

  return posts
}
