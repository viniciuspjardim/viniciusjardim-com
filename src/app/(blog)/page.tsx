import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import 'server-only'

import { Post } from '~/components/post/Post'
import { api } from '~/trpc/server'

export default async function HomePage() {
  const posts = await api.posts.getAll.query()

  return (
    <main className="w-full max-w-3xl flex-col items-center space-y-6 px-2">
      <Link
        className="flex items-center justify-center gap-2 text-xl text-sky-300 opacity-80 transition-all duration-200 hover:opacity-100"
        href="/p/color-beans"
      >
        <Image
          src="/color-beans-icon.png"
          width={36}
          height={36}
          alt="Color Beans logo"
        />
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
