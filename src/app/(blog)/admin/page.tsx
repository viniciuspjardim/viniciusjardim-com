import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'

import { env } from '~/env'
import { api, HydrateClient } from '~/trpc/server'
import { AdminNav } from '~/components/admin-nav'
import { WidthContainer } from '~/components/width-container'
import { EditPostList } from '~/components/post/edit-post-list'

export default async function AdminPage() {
  const user = await currentUser()

  if (!user) {
    return <RedirectToSignIn />
  } else if (user.id !== env.SITE_OWNER_USER_ID) {
    return redirect('/')
  }

  void api.posts.getAll.prefetch({ showUnpublished: true })
  void api.categories.getAll.prefetch()

  return (
    <HydrateClient>
      <WidthContainer className="space-y-8 px-4 py-16 md:px-10">
        <AdminNav />
        <EditPostList />
      </WidthContainer>
    </HydrateClient>
  )
}
