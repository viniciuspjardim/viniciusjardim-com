import 'server-only'

import type { Metadata } from 'next'

import { env } from '~/env.mjs'
import { Post } from '~/components/post/post'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'

export default async function PostPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const post = await api.posts.getOneBySlug.query({ slug })

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="w-full space-y-12 py-12">
        <Post
          key={post.id}
          slug={post.slug}
          title={post.title}
          content={post.content}
          writtenAt={new Date(post.writtenAt)}
          userName={post.author?.userName ?? 'Unknown'}
          userImageUrl={post.author?.userImageUrl}
        />
      </div>
    </WidthContainer>
  )
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await api.posts.getOneBySlug.query({ slug })
  const baseUrl = new URL(env.NEXT_PUBLIC_SITE_URL)

  let authorName = 'Vinícius Jardim'

  if (post.author?.firstName && post.author?.lastName) {
    authorName = `${post.author.firstName} ${post.author.lastName}`
  } else if (post.author?.userName) {
    authorName = post.author.userName
  }

  return {
    title: post.title,
    description: post.description,
    applicationName: 'Vinícius Jardim Blog',
    metadataBase: baseUrl,
    keywords: post.keywords,
    authors: { name: authorName, url: baseUrl },
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      type: 'article',
      url: `/posts/${post.slug}`,
    },
  }
}
