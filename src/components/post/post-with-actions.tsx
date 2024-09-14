import type { JSONContent } from '@tiptap/core'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { JsonParser } from './json-parser'
import { api } from '~/utils/api'
import { EditPostForm } from './edit-post-form'

type PostWithActionsProps = {
  id: number
  slug: string
  title: string
  content: string
  userName: string
  userImageUrl?: string
  rank: number
  categoryId: number
  writtenAt: Date
}

export function PostWithActions({
  id,
  slug,
  title,
  content,
  userName,
  userImageUrl,
  rank,
  categoryId,
  writtenAt,
}: PostWithActionsProps) {
  const ctx = api.useUtils()

  const [isEditing, setIsEditing] = useState(false)

  const { mutate: remove, isLoading: isRemovingPost } =
    api.posts.remove.useMutation({
      onSuccess: async () => {
        await ctx.posts.getAll.invalidate()
      },
    })

  if (isEditing)
    return (
      <EditPostForm
        id={id}
        title={title}
        content={content}
        userName={userName}
        userImageUrl={userImageUrl}
        rank={rank}
        categoryId={categoryId}
        writtenAt={writtenAt}
        closeForm={() => setIsEditing(false)}
      />
    )

  const jsonContent = JSON.parse(content) as JSONContent

  return (
    <article className="w-full space-y-4">
      <div className="flex justify-between">
        <Link
          className="decoration-rose-800 hover:underline"
          href={`/posts/${slug}`}
        >
          <h2 className="text-2xl font-bold text-neutral-300 md:text-4xl">
            {title}
          </h2>
        </Link>

        <div className="flex justify-center gap-4">
          <button
            className="opacity-70 transition hover:opacity-100"
            disabled={isRemovingPost}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>

          <button
            className="opacity-70 transition hover:opacity-100"
            disabled={isRemovingPost}
            onClick={() => remove({ id })}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        {userImageUrl && (
          <Image
            className="mt-1 h-10 w-10 rounded-full"
            src={userImageUrl}
            alt={userName}
            width={40}
            height={40}
            quality={100}
          />
        )}

        <div>
          <p className="text-md font-semibold text-rose-800">{userName}</p>
          <p className="text-sm">{writtenAt.toLocaleDateString()}</p>
        </div>
      </div>

      <JsonParser {...jsonContent} />
    </article>
  )
}
