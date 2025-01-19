import 'server-only'

import { Post } from '~/components/post/post'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'

export default async function HomePage() {
  const posts = await api.posts.getAll.query()

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="w-full space-y-12 py-12">
        {posts?.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            description={post.description}
            content={post.content}
            writtenAt={new Date(post.writtenAt)}
            userName={post.author?.userName ?? 'Unknown'}
            userImageUrl={post.author?.userImageUrl}
          />
        ))}
      </div>
    </WidthContainer>
  )
}
