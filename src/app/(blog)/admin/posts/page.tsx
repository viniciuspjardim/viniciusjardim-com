import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'

import { CreatePostForm } from '~/components/post/create-post-form'
import { EditPostList } from '~/components/post/edit-post-list'
import { WidthContainer } from '~/components/width-container'
import { env } from '~/env'
import { api, HydrateClient } from '~/trpc/server'

export default async function PostsAdminPage() {
  const user = await currentUser()

  if (!user) {
    return <RedirectToSignIn />
  } else if (user.id !== env.SITE_OWNER_USER_ID) {
    return redirect('/')
  }

  void api.posts.getAll.prefetch({ showUnpublished: true })
  void api.categories.getAllFlat.prefetch()

  return (
    <HydrateClient>
      <WidthContainer className="space-y-12 py-12">
        <h1 className="text-3xl font-semibold">Posts</h1>

        <div>
          <h2 className="mb-6 text-2xl font-semibold">Create post</h2>
          <CreatePostForm
            userName={user.fullName || 'Anonymous'}
            userImageUrl={user.imageUrl}
          />
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-semibold">Edit posts</h2>
          <EditPostList />
        </div>
      </WidthContainer>
    </HydrateClient>
  )
}
