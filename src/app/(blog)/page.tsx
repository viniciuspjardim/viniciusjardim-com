import 'server-only'

import { PostCard } from '~/components/post/post-card'
import { WidthContainer } from '~/components/width-container'
import { ColorBeans } from '~/components/projects/color-beans'
import { api } from '~/trpc/server'
import { formatAuthorName } from '~/helpers/format-author-name'

export default async function HomePage() {
  const posts = await api.posts.getAll.query()

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <ColorBeans />

      <div className="mb-16 divide-y divide-dashed divide-neutral-800">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            userName={formatAuthorName(post.author)}
            userImageUrl={post.author?.userImageUrl}
          />
        ))}
      </div>
    </WidthContainer>
  )
}
