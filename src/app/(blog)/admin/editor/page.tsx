import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'

import { Editor } from '~/components/editor'
import { env } from '~/env'
import { api, HydrateClient } from '~/trpc/server'

export default async function EditorPage(props: PageProps<'/admin/editor'>) {
  const query = await props.searchParams
  const user = await currentUser()

  if (!user) {
    return <RedirectToSignIn />
  } else if (user.id !== env.SITE_OWNER_USER_ID) {
    return redirect('/')
  }

  const post = query.postId
    ? await api.posts.getOneById({ id: parseInt(query.postId as string, 10) })
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
