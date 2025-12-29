import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { InfoIcon } from 'lucide-react'

import { db } from '~/db'
import { PostCard } from '~/components/post/post-card'
import { formatAuthorName } from '~/helpers/format-author-name'

export default async function CategoryPage(
  props: PageProps<'/categories/[[...slug]]'>
) {
  'use cache'
  cacheLife('max')
  cacheTag('posts-list')

  const params = await props.params
  const categorySlug = params.slug?.[0]

  const posts = await db.post.getAllByCategorySlug(categorySlug)

  if (!posts || posts.length === 0) {
    return (
      <div className="mt-10 w-full rounded-md border px-6 py-40 text-center">
        <InfoIcon className="mx-auto size-8 text-rose-800" />
        <span className="mx-auto mt-2 block max-w-lg text-lg font-semibold text-balance text-neutral-300">
          Oops, no posts around here yet...
        </span>
        <span className="mx-auto block max-w-lg text-lg text-balance text-neutral-400">
          Please come back later, we might have something for you!
        </span>
      </div>
    )
  }

  return posts.map((post, index) => (
    <PostCard
      key={post.id}
      post={post}
      userName={formatAuthorName(post.author)}
      userImageUrl={post.author?.userImageUrl}
      isPriorityImage={index < 2}
    />
  ))
}

export async function generateStaticParams() {
  'use cache'
  cacheLife('max')
  cacheTag('categories-list')

  const categories = await db.category.getAll()

  // Return an array with the default (all categories) and each category slug
  return [
    { slug: undefined }, // For the default route without slug
    ...categories.map((category) => ({
      slug: [category.slug],
    })),
  ]
}
