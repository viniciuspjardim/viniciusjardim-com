import Image from 'next/image'
import Link from 'next/link'
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
const revalidate = 60 * 60 * 24 // 24 hours

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
    <main className="w-full max-w-3xl flex-col items-center space-y-6 px-2">
      <Link
        className="flex items-center justify-center gap-2 text-xl text-sky-300 opacity-80 transition-all duration-200 hover:opacity-100"
        href="/p/color-beans"
      >
        <Image src="/icon.png" width={36} height={36} alt="Color Beans logo" />
        <span>Color Beans (Game)</span>
      </Link>

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
  )
}
