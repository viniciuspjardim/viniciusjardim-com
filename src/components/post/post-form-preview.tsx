'use client'

import type { JSONContent } from '@tiptap/core'
import type { s } from '~/db'
import { parseISO } from 'date-fns'
import { Post } from '~/components/post/post'
import { formatName } from '~/helpers/format-author-name'

type PostObject = {
  id: number | undefined
  slug: string
  title: string
  description: string | undefined
  keywords: string | undefined
  content: JSONContent
  rank: number | undefined
  lang: string | undefined
  writtenAt: Date | undefined
  categoryId: number
  published: boolean
}

export interface PostFormPreviewProps {
  postPreview: PostObject | null
  userName?: string
  userImageUrl?: string
  initialPostData?: s.Post
}

export function PostFormPreview({
  postPreview,
  userName,
  userImageUrl,
  initialPostData,
}: PostFormPreviewProps) {
  if (!postPreview) {
    return null
  }

  return (
    <Post
      className="py-16"
      post={{
        ...postPreview,
        id: postPreview.id ?? 1,
        description: postPreview.description ?? '',
        keywords: postPreview.keywords ?? '',
        rank: postPreview.rank ?? 0,
        lang: postPreview.lang ?? 'en-US',
        writtenAt: postPreview.writtenAt ?? parseISO('2025-01-01'),
        authorId: initialPostData?.authorId ?? '1',
        createdAt: initialPostData?.createdAt ?? parseISO('2025-01-01'),
        updatedAt: initialPostData?.updatedAt ?? parseISO('2025-01-01'),
      }}
      userName={formatName(userName)}
      userImageUrl={userImageUrl}
    />
  )
}
