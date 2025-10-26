import 'server-only'

import { InfoIcon } from 'lucide-react'
import { PostCard } from '~/components/post/post-card'
import { api } from '~/trpc/server'
import { formatAuthorName } from '~/helpers/format-author-name'

export default async function CategoryPage(
  props: PageProps<'/categories/[[...slug]]'>
) {
  const categorySlug = (await props.params).slug?.[0]
  const posts = await api.posts.getAllByCategorySlug({ categorySlug })

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

      {posts.length === 0 && (
        <div className="mt-10 w-full rounded-md border px-6 py-40 text-center">
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
