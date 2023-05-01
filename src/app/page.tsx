import React from 'react'
import 'server-only'

import { Post } from '~/components/post/Post'

type ResultObject<T> = {
  result: { data: { json: T } }
}

type PostType = {
  id: number
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
  writtenAt: string
  published: boolean
  author: {
    id: string
    userName: string
    userImageUrl: string
    firstName: string | null
    lastName: string | null
  }
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
const revalidate = 60 * 10 // 10 minutes

async function fetchPosts() {
  const res = await fetch(`${baseUrl}/api/trpc/posts.getAll`, {
    next: { revalidate },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch posts data')
  }

  const {
    result: {
      data: { json: posts },
    },
  } = (await res.json()) as ResultObject<PostType[]>

  return posts
}

export default async function HomePage() {
  const posts = await fetchPosts()

  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        A <span className="text-rose-500">draft</span> blog!
      </h1>

      <main className="w-full max-w-3xl flex-col items-center space-y-6 px-2">
        {posts?.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            content={post.content}
            writtenAt={new Date(post.writtenAt)}
            userName={post.author?.userName ?? 'Unknown'}
            userImageUrl={post.author?.userImageUrl}
          />
        ))}
      </main>
    </>
  )
}
