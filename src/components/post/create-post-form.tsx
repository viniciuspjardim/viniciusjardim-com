'use client'

import type { JSONContent } from '@tiptap/core'

import { api } from '~/trpc/react'
import { asSlug } from '~/helpers/as-slug'
import { PostForm, type PostFormInputs } from './post-form'

type CreatePostFormProps = {
  userName: string
  userImageUrl?: string
}

export function CreatePostForm({
  userName,
  userImageUrl,
}: CreatePostFormProps) {
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
      content: JSON.parse(content) as JSONContent,
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      categoryId: parseInt(form.categoryId, 10),
      lang: form.lang ? form.lang : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      published: form.published ?? false,
    })
  }

  return (
    <PostForm
      isPosting={isPosting}
      onSubmit={handleSubmit}
      userName={userName}
      userImageUrl={userImageUrl}
    />
  )
}
