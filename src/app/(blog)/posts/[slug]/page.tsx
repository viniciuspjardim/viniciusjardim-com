import 'server-only'

import { Post } from '~/components/post/post'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'

export default async function HomePage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const post = await api.posts.getOneBySlug.query({ slug })

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="w-full space-y-12 py-12">
        <Post
          key={post.id}
          slug={post.slug}
          title={post.title}
          content={post.content}
          writtenAt={new Date(post.writtenAt)}
          userName={post.author?.userName ?? 'Unknown'}
          userImageUrl={post.author?.userImageUrl}
        />
      </div>
    </WidthContainer>
  )
}
