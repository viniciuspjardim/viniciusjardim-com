import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

export function AddPost() {
  const { user } = useUser()
  const [isExpanded, setIsExpanded] = useState(false)

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
          <input className="w-full" placeholder="Title" />

          <textarea className="h-32 w-full" placeholder="Your post here..." />

          <hr className="mt-4 w-40 border border-slate-500 opacity-25" />
        </>
      )}
    </div>
  )
}
