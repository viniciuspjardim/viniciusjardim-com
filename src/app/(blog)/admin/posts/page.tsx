'use client'

import { useUser } from '@clerk/nextjs'

import { CreatePostForm } from '~/components/post/create-post-form'
import { PostWithActions } from '~/components/post/post-with-actions'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/utils/api'
import { formatAuthorName } from '~/helpers/format-author-name'

const pageName = 'Posts'

export default function PostsAdminPage() {
  const { data, isLoading } = api.posts.getAll.useQuery({
    showUnpublished: true,
  })
  const { user } = useUser()

  if (!user) {
    return (
      <WidthContainer className="space-y-8 py-12">
        <h1 className="text-3xl">{pageName}</h1>

        <p className="rounded-r-md border-l-4 border-rose-600 bg-neutral-900 p-4 text-base">
          <strong>Info:</strong> please sign in to access {pageName}.
        </p>
      </WidthContainer>
    )
  }

  return (
    <WidthContainer className="space-y-12 py-12">
      <h1 className="text-3xl">{pageName}</h1>

      <CreatePostForm />

      {isLoading && <p>Loading...</p>}

      {data && data.length > 0 && (
        <div className="divide-y divide-neutral-800 overflow-hidden rounded-lg border border-neutral-800">
          {data?.map((post) => (
            <PostWithActions
              key={post.id}
              post={post}
              userName={formatAuthorName(post.author)}
              userImageUrl={post.author?.userImageUrl}
            />
          ))}
        </div>
      )}
    </WidthContainer>
  )
}
