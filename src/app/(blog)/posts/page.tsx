import 'server-only'

import { PostCard } from '~/components/post/post-card'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'
import { formatAuthorName } from '~/helpers/format-author-name'

export default async function PostsPage() {
  const posts = await api.posts.getAll()

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="my-16 divide-y divide-dashed divide-neutral-800">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            userName={formatAuthorName(post.author)}
            userImageUrl={post.author?.userImageUrl as string | undefined}
          />
        ))}
      </div>
    </WidthContainer>
  )
}
