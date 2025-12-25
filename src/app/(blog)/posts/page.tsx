import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { db } from '~/db'
import { PostCard } from '~/components/post/post-card'
import { WidthContainer } from '~/components/width-container'
import { formatAuthorName } from '~/helpers/format-author-name'

export default async function PostsPage() {
  'use cache'
  cacheLife('max')
  cacheTag('home-page')

  const posts = await db.post.getAll()

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="mb-6 w-full divide-y divide-dashed">
        {posts?.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            userName={formatAuthorName(post.author)}
            userImageUrl={post.author?.userImageUrl}
            isPriorityImage={index < 2}
          />
        ))}
      </div>
    </WidthContainer>
  )
}
