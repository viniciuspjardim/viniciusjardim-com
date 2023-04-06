import { useState } from 'react'
import Image from 'next/image'

import { api } from '~/utils/api'
import { EditPostForm } from './EditPostForm'

type PostWithActionsProps = {
  id: number
  title: string
  content: string
  userName: string
  userImageUrl?: string
  rank: number
  writtenAt: Date
}

export function PostWithActions({
  id,
  title,
  content,
  userName,
  userImageUrl,
  rank,
  writtenAt,
}: PostWithActionsProps) {
  const ctx = api.useContext()

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
        writtenAt={writtenAt}
        closeForm={() => setIsEditing(false)}
      />
    )

  return (
    <article className="w-full rounded-md bg-slate-900/75 p-2 md:p-8">
      <div className="flex justify-between">
        <h2 className="text-xl text-rose-500 md:text-2xl">{title}</h2>

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

      <pre className="text-md my-4 whitespace-pre-wrap font-sans md:my-6 md:text-xl">
        {content}
      </pre>

      <div className="flex justify-end gap-x-2">
        <div className="text-right">
          <p className="text-md text-rose-500">{userName}</p>

          <p className="text-sm text-slate-500">
            {writtenAt.toLocaleDateString()}
          </p>
        </div>

        {userImageUrl && (
          <Image
            className="h-12 w-12 rounded-full"
            src={userImageUrl}
            alt={userName}
            width={48}
            height={48}
            quality={100}
          />
        )}
      </div>
    </article>
  )
}
