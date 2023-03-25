import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { api } from '~/utils/api'

export function AddPost() {
  const { user } = useUser()

  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
      setIsExpanded(false)
      setTitle('')
      setContent('')
    },
  })

  if (!user) return null

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3 px-4">
      <button className="min-w-24" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? (
          <span className="font-mono">-</span>
        ) : (
          <span className="font-mono">+</span>
        )}{' '}
        Write A New Post
      </button>

      {isExpanded && (
        <>
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
        </>
      )}
    </div>
  )
}
