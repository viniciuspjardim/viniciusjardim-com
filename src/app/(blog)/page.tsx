import 'server-only'

import Image from 'next/image'
import Link from 'next/link'

import { PostCard } from '~/components/post/post-card'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'

export default async function HomePage() {
  const posts = await api.posts.getAll.query()

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <Link
        className="my-16 flex w-full items-center justify-center gap-6 rounded-2xl border border-neutral-900 bg-neutral-950 px-8 py-4 text-xl transition-all hover:border-neutral-800 hover:bg-neutral-900 sm:w-auto"
        href="/p/color-beans"
      >
        <Image
          src="/color-beans-2-icon.png"
          width={42}
          height={42}
          alt="Color Beans logo"
        />
        <span>Play Color Beans</span>
      </Link>

      <div className="divide-y divide-dashed divide-neutral-800">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            slug={post.slug}
            title={post.title}
            description={post.description}
            content={post.content}
            writtenAt={new Date(post.writtenAt)}
            userName={post.author?.userName ?? 'Unknown'}
            userImageUrl={post.author?.userImageUrl}
          />
        ))}
      </div>
    </WidthContainer>
  )
}
