import { useState } from 'react'
import Image from 'next/image'

import { api } from '~/utils/api'

type EditPostFormProps = {
  id: number
  title: string
  content: string
  userName: string
  userImageUrl?: string
  closeForm: () => void
}

export function EditPostForm({
  id,
  title,
  content,
  userName,
  userImageUrl,
  closeForm,
}: EditPostFormProps) {
  const [titleValue, setTitleValue] = useState(title)
  const [contentValue, setContentValue] = useState(content)

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.update.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
      closeForm()
    },
  })

  return (
    <div className="flex w-full max-w-3xl gap-3 px-2">
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

      <div className="flex w-full flex-col space-y-4">
        <input
          className="w-full"
          type="text"
          placeholder="Title"
          disabled={isPosting}
          value={titleValue}
          onChange={(e) => {
            setTitleValue(e.target.value)
          }}
        />

        <textarea
          className="h-32 w-full"
          placeholder="Your post here..."
          disabled={isPosting}
          value={contentValue}
          onChange={(e) => {
            setContentValue(e.target.value)
          }}
        />

        <div className="flex w-full justify-end space-x-2">
          <button
            className="w-32 rounded border border-slate-500 bg-slate-900/75 p-2"
            disabled={isPosting}
            onClick={() =>
              mutate({ id, title: titleValue, content: contentValue })
            }
          >
            Save Post
          </button>

          <button
            className="w-32 rounded border border-slate-500 bg-slate-900/75 p-2"
            disabled={isPosting}
            onClick={closeForm}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
