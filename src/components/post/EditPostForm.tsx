import { useState } from 'react'
import Image from 'next/image'

import { api } from '~/utils/api'
import { asSlug } from '~/helpers/asSlug'

type EditPostFormProps = {
  id: number
  title: string
  content: string
  userName: string
  userImageUrl?: string
  rank: number
  writtenAt: Date
  closeForm: () => void
}

export function EditPostForm({
  id,
  title,
  content,
  userName,
  userImageUrl,
  rank,
  writtenAt,
  closeForm,
}: EditPostFormProps) {
  const [titleValue, setTitleValue] = useState(title)
  const [moreOptions, setMoreOptions] = useState(false)
  const [rankValue, setRankValue] = useState(String(rank))
  const [writtenAtValue, setWrittenAtValue] = useState(writtenAt.toISOString())
  const [contentValue, setContentValue] = useState(content)

  const slugValue = asSlug(titleValue)

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.update.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
      closeForm()
    },
  })

  return (
    <div className="flex w-full max-w-3xl flex-col space-y-3 px-2">
      <div className="flex space-x-3">
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

        <div className="flex w-full flex-col space-y-1">
          <input
            type="text"
            placeholder="Title"
            disabled={isPosting}
            value={titleValue}
            onChange={(e) => {
              setTitleValue(e.target.value)
            }}
          />

          <div className="flex justify-between">
            <p className="text-sm opacity-40">➡️ {slugValue || 'Post Slug'}</p>

            <button onClick={() => setMoreOptions(!moreOptions)}>
              {moreOptions ? '-' : '+'} Options
            </button>
          </div>
        </div>
      </div>

      {moreOptions && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Rank"
            disabled={isPosting}
            value={rankValue}
            onChange={(e) => {
              setRankValue(e.target.value)
            }}
          />

          <input
            type="text"
            placeholder="Written at (YYYY-MM-DD)"
            disabled={isPosting}
            value={writtenAtValue}
            onChange={(e) => {
              setWrittenAtValue(e.target.value)
            }}
          />
        </div>
      )}

      <textarea
        className="h-48"
        placeholder="Write your post here..."
        disabled={isPosting}
        value={contentValue}
        onChange={(e) => {
          setContentValue(e.target.value)
        }}
      />

      <div className="flex justify-end space-x-2">
        <button
          className="w-32 rounded border border-slate-500 bg-slate-900/75 p-2"
          disabled={isPosting}
          onClick={() =>
            mutate({
              id,
              title: titleValue,
              slug: slugValue,
              content: contentValue,
              rank: rankValue ? parseInt(rankValue, 10) : undefined,
              writtenAt: writtenAtValue ? new Date(writtenAtValue) : undefined,
              categoryId: 1,
            })
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
  )
}
