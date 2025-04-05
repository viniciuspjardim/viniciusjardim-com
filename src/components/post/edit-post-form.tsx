import type { JSONContent } from '@tiptap/core'
import type { s } from '~/db'

import { api } from '~/trpc/react'
import { asSlug } from '~/helpers/as-slug'
import { Button } from '~/components/ui/button'
import { PostForm, type PostFormInputs } from './post-form'

type EditPostFormProps = {
  post: s.Post
  userName: string
  userImageUrl?: string
  closeForm: () => void
}

export function EditPostForm({
  post,
  userName,
  userImageUrl,
  closeForm,
}: EditPostFormProps) {
  const ctx = api.useUtils()

  const { mutateAsync, isPending: isPosting } = api.posts.update.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
      closeForm()
    },
  })

  async function handleSubmit(form: PostFormInputs, content: string) {
    return mutateAsync({
      id: post.id,
      slug: asSlug(form.title),
      title: form.title,
      description: form.description || undefined,
      keywords: form.keywords || undefined,
      content: JSON.parse(content) as JSONContent,
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      lang: form.lang ? form.lang : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      categoryId: parseInt(form.categoryId, 10),
      published: form.published ?? false,
    })
  }

  const defaultValues = { ...post }

  const extraActions = (
    <Button variant="outline" type="button" onClick={closeForm}>
      Cancel
    </Button>
  )

  return (
    <PostForm
      defaultValues={defaultValues}
      isPosting={isPosting}
      onSubmit={handleSubmit}
      userName={userName}
      userImageUrl={userImageUrl}
      extraActions={extraActions}
    />
  )
}
