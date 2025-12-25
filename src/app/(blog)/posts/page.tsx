import 'server-only'

import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'

import { db } from '~/db'
import { PostCard } from '~/components/post/post-card'
import { WidthContainer } from '~/components/width-container'
import { formatAuthorName } from '~/helpers/format-author-name'
import { PostCardListSkeleton } from '~/components/post/post-card'

async function PostCardList() {
  'use cache'
  cacheLife('max')
  cacheTag('home-page')

  const posts = await db.post.getAll()

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

export default function PostsPage() {
  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="mb-6 w-full divide-y divide-dashed">
        <Suspense fallback={<PostCardListSkeleton />}>
          <PostCardList />
        </Suspense>
      </div>
    </WidthContainer>
  )
}
