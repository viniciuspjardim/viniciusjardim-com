import 'server-only'

import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { InfoIcon } from 'lucide-react'

import type { GetAllPostsResponse } from '~/db/entities/post'
import { env } from '~/env'
import { PostCard, PostCardListSkeleton } from '~/components/post/post-card'
import { formatAuthorName } from '~/helpers/format-author-name'

async function CategoryPostsList({ categorySlug }: { categorySlug?: string }) {
  'use cache'
  cacheLife('max')
  cacheTag('category-page')

  const baseUrl = env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  const url = categorySlug
    ? `${baseUrl}/api/posts/get-all-by-category-slug/${categorySlug}`
    : `${baseUrl}/api/posts/get-all-by-category-slug`

  const posts = await fetch(url).then(
    (res) => res.json() as GetAllPostsResponse
  )

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

  return (
    <>
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          userName={formatAuthorName(post.author)}
          userImageUrl={post.author?.userImageUrl}
          isPriorityImage={index < 2}
        />
      ))}
    </>
  )
}

export default async function CategoryPage(
  props: PageProps<'/categories/[[...slug]]'>
) {
  const categorySlug = (await props.params).slug?.[0]

  return (
    <Suspense fallback={<PostCardListSkeleton />}>
      <CategoryPostsList categorySlug={categorySlug} />
    </Suspense>
  )
}
