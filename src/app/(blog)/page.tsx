import 'server-only'

import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'

import type { GetAllPostsResponse } from '~/db/entities/post'
import { env } from '~/env'
import { PostCard } from '~/components/post/post-card'
import { WidthContainer } from '~/components/width-container'
import { ColorBeans } from '~/components/projects/color-beans'
import { formatAuthorName } from '~/helpers/format-author-name'
import { PostCardListSkeleton } from '~/components/post/post-card'

async function HomePostsList() {
  'use cache'
  cacheLife('max')
  cacheTag('home-page')

  const baseUrl = env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  const posts = await fetch(`${baseUrl}/api/posts/get-all`).then(
    (res) => res.json() as GetAllPostsResponse
  )

  return posts?.map((post, index) => (
    <PostCard
      key={post.id}
      post={post}
      userName={formatAuthorName(post.author)}
      userImageUrl={post.author?.userImageUrl}
      isPriorityImage={index < 2}
    />
  ))
}

export default function HomePage() {
  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <ColorBeans />

      <div className="mb-6 w-full divide-y divide-dashed">
        <Suspense fallback={<PostCardListSkeleton />}>
          <HomePostsList />
        </Suspense>
      </div>
    </WidthContainer>
  )
}
