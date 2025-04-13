import 'server-only'

import { InfoIcon } from 'lucide-react'
import { PostCard } from '~/components/post/post-card'
import { api } from '~/trpc/server'
import { formatAuthorName } from '~/helpers/format-author-name'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug?.[0]
  // TODO: fetch only the posts. This request is fetching also the categories
  const { posts } = await api.pages.getAllPostsByCategorySlug({
    categorySlug: slug,
  })

  await new Promise((resolve) => setTimeout(resolve, 5000))

  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          userName={formatAuthorName(post.author)}
          userImageUrl={post.author?.userImageUrl}
        />
      ))}

      {posts.length === 0 && (
        <div className="w-full rounded-md border px-6 py-44 text-center">
          <InfoIcon className="mx-auto size-8 text-rose-800" />
          <span className="mx-auto mt-2 block max-w-lg text-lg font-semibold text-balance text-neutral-300">
            Oops, no posts around here yet...
          </span>
          <span className="mx-auto block max-w-lg text-lg text-balance text-neutral-400">
            Please come back later, we might have something for you!
          </span>
        </div>
      )}
    </>
  )
}
