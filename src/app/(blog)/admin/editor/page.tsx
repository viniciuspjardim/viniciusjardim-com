import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'

import { Editor } from '~/components/editor'
import { env } from '~/env'
import { api, HydrateClient } from '~/trpc/server'

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const postId = (await searchParams).postId
  const user = await currentUser()

  if (!user) {
    return <RedirectToSignIn />
  } else if (user.id !== env.SITE_OWNER_USER_ID) {
    return redirect('/')
  }

  const post = postId
    ? await api.posts.getOneById({ id: parseInt(postId, 10) })
    : undefined
  void api.categories.getAll.prefetch()

  return (
    <HydrateClient>
      <Editor
        initialPostData={post}
        userName={user.fullName || 'Anonymous'}
        userImageUrl={user.imageUrl}
      />
    </HydrateClient>
  )
}
