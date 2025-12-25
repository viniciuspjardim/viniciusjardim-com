import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'
import { Suspense } from 'react'

import { Editor } from '~/components/editor'
import { env } from '~/env'
import { api, HydrateClient } from '~/trpc/server'

async function EditorPageContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ postId?: string }>
}) {
  const query = await searchParamsPromise

  const post = query.postId
    ? await api.posts.getOneById({ id: parseInt(query.postId as string, 10) })
    : undefined

  void api.categories.getAll.prefetch()

  const user = await currentUser()
  if (!user) {
    return null
  }

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

export default async function EditorPage(props: PageProps<'/admin/editor'>) {
  const user = await currentUser()

  if (!user) {
    return <RedirectToSignIn />
  } else if (user.id !== env.SITE_OWNER_USER_ID) {
    return redirect('/')
  }

  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditorPageContent searchParamsPromise={props.searchParams} />
    </Suspense>
  )
}
