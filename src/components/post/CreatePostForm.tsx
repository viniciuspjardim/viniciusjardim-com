import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'

import { api } from '~/utils/api'
import { asSlug } from '~/helpers/asSlug'

export function CreatePostForm() {
  const { user } = useUser()

  const [title, setTitle] = useState('')
  const [moreOptions, setMoreOptions] = useState(false)
  const [rank, setRank] = useState('')
  const [writtenAt, setWrittenAt] = useState('')
  const [content, setContent] = useState('')

  const slug = asSlug(title)

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
      setTitle('')
      setMoreOptions(false)
      setRank('')
      setWrittenAt('')
      setContent('')
    },
  })

  if (!user) return null

  return (
    <div className="flex w-full max-w-3xl flex-col space-y-3 px-2">
      <div className="flex space-x-3">
        <Image
          className="h-12 w-12 rounded-full"
          src={user.profileImageUrl}
          alt={user.username ?? 'unknown user name'}
          width={48}
          height={48}
          quality={100}
        />

        <div className="flex w-full flex-col space-y-1">
          <input
            type="text"
            placeholder="Title"
            disabled={isPosting}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />

          <div className="flex justify-between">
            <p className="text-sm opacity-40">➡️ {slug || 'Post Slug'}</p>

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
            value={rank}
            onChange={(e) => {
              setRank(e.target.value)
            }}
          />

          <input
            type="text"
            placeholder="Written at (YYYY-MM-DD)"
            disabled={isPosting}
            value={writtenAt}
            onChange={(e) => {
              setWrittenAt(e.target.value)
            }}
          />
        </div>
      )}

      <textarea
        className="h-48"
        placeholder="Write your post here..."
        disabled={isPosting}
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
        }}
      />

      <div className="flex justify-end">
        <button
          className="w-32 rounded border border-slate-500 bg-slate-900/75 p-2"
          disabled={isPosting}
          onClick={() =>
            mutate({
              title,
              slug,
              content,
              rank: rank ? parseInt(rank, 10) : undefined,
              writtenAt: writtenAt ? new Date(writtenAt) : undefined,
              categoryId: 1,
            })
          }
        >
          Publish Post
        </button>
      </div>
    </div>
  )
}
