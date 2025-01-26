import 'server-only'

import { InfoIcon } from 'lucide-react'
import { PostCard } from '~/components/post/post-card'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'
import { formatAuthorName } from '~/helpers/format-author-name'
import { CategoryPill } from '~/components/category/category-pill'

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug?.[0]
  const { categories, posts } = await api.posts.getAllByCategorySlug.query({
    categorySlug: slug,
  })

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="flex w-full flex-wrap gap-2 pt-16">
        <CategoryPill title="All" selectedSlug={slug} />
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            selectedSlug={slug}
            slug={category.slug}
            title={category.title}
          />
        ))}
      </div>

      <div className="my-16 w-full divide-y divide-dashed divide-neutral-800">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            slug={post.slug}
            title={post.title}
            description={post.description}
            content={post.content}
            writtenAt={new Date(post.writtenAt)}
            userName={formatAuthorName(post.author)}
            userImageUrl={post.author?.userImageUrl}
          />
        ))}

        {posts.length === 0 && (
          <div className="w-full rounded-md border border-neutral-800 py-24 text-center">
            <InfoIcon className="mx-auto size-8 text-rose-800" />
            <span className="mt-2 block text-lg text-neutral-400">
              No posts here yet!
            </span>
          </div>
        )}
      </div>
    </WidthContainer>
  )
}
