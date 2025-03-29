import { useUser } from '@clerk/nextjs'

import { api } from '~/trpc/react'
import { asSlug } from '~/helpers/as-slug'
import { PostForm, type PostFormInputs } from './post-form'

export function CreatePostForm() {
  const { user } = useUser()
  const ctx = api.useUtils()

  const { mutateAsync, isPending: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
    },
  })

  async function handleSubmit(form: PostFormInputs, content: string) {
    return mutateAsync({
      slug: asSlug(form.title),
      title: form.title,
      description: form.description || undefined,
      keywords: form.keywords || undefined,
      content,
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      categoryId: parseInt(form.categoryId, 10),
      lang: form.lang ? form.lang : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      published: form.published ?? false,
    })
  }

  if (!user) return null

  return (
    <PostForm
      userName={user.username || 'Anonymous'}
      userImageUrl={user.imageUrl}
      onSubmit={handleSubmit}
      isPosting={isPosting}
    />
  )
}
