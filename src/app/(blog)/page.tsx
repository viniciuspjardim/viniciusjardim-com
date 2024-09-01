import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import 'server-only'

import { Post } from '~/components/post/post-2'
import { api } from '~/trpc/server'

export default async function HomePage() {
  const posts = await api.posts.getAll.query()

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 md:px-10">
      <Link
        className="my-12 flex items-center justify-center gap-4 rounded-xl border border-gray-900 px-8 py-4 text-xl"
        href="/p/color-beans"
      >
        <Image
          src="/color-beans-icon.png"
          width={36}
          height={36}
          alt="Color Beans logo"
        />
        <span>Play Color Beans</span>
      </Link>

      <div className="w-full space-y-24 pb-12">
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
      </div>
    </main>
  )
}
