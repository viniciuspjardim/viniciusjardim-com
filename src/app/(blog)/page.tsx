import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { db } from '~/db'
import { PostCard } from '~/components/post/post-card'
import { WidthContainer } from '~/components/width-container'
import { ColorBeans } from '~/components/projects/color-beans'
import { formatAuthorName } from '~/helpers/format-author-name'

export default async function HomePage() {
  'use cache'
  cacheLife('max')
  cacheTag('posts-list')

  const posts = await db.post.getAll()

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="mt-16 mb-6 px-5 md:px-10">
        <ColorBeans />
      </div>

      <div className="mb-6 w-full md:divide-y">
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
