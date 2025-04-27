import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'

import { PostForm } from '~/components/post/post-form'
import { WidthContainer } from '~/components/width-container'
import { env } from '~/env'
import { api, HydrateClient } from '~/trpc/server'

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const slug = (await searchParams).slug
  const user = await currentUser()

  if (!user) {
    return <RedirectToSignIn />
  } else if (user.id !== env.SITE_OWNER_USER_ID) {
    return redirect('/')
  }

  const post = slug ? await api.posts.getOneBySlug({ slug }) : undefined
  void api.categories.getAll.prefetch()

  return (
    <HydrateClient>
      <WidthContainer className="space-y-8 py-16">
        <h1 className="text-3xl font-semibold">Editor</h1>

        <PostForm
          initialPostData={post}
          userName={user.fullName || 'Anonymous'}
          userImageUrl={user.imageUrl}
        />
      </WidthContainer>
    </HydrateClient>
  )
}
