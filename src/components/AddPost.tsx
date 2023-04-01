import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'

import { api } from '~/utils/api'

export function AddPost() {
  const { user } = useUser()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
      setTitle('')
      setContent('')
    },
  })

  if (!user) return null

  return (
    <div className="flex w-full max-w-3xl gap-3 px-2">
      <Image
        className="h-12 w-12 rounded-full"
        src={user.profileImageUrl}
        alt={user.username ?? 'unknown user name'}
        width={48}
        height={48}
        quality={100}
      />

      <div className="flex w-full flex-col space-y-4">
        <input
          className="w-full"
          type="text"
          placeholder="Title"
          disabled={isPosting}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />

        <textarea
          className="h-32 w-full"
          placeholder="Your post here..."
          disabled={isPosting}
          onChange={(e) => {
            setContent(e.target.value)
          }}
        />

        <div className="flex w-full justify-end">
          <button
            className="w-32 rounded border border-slate-500 bg-slate-900/75 p-2"
            disabled={isPosting}
            onClick={() => mutate({ title, content })}
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  )
}
