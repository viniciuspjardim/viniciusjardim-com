import 'server-only'

import type { Metadata } from 'next'
import type { JSONContent } from '@tiptap/core'

import { env } from '~/env.mjs'
import { Post } from '~/components/post/post'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'
import { findPostNode } from '~/helpers/find-post-node'
import { formatAuthorName } from '~/helpers/format-author-name'
import { PostBreadcrumb } from '~/components/ui/breadcrumb'

export default async function PostPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const post = await api.posts.getOneBySlug.query({ slug })
  const categories = await api.categories.getAllFlat.query()

  return (
    <WidthContainer className="w-full py-16">
      <PostBreadcrumb categories={categories} categoryId={post.categoryId} />
      <Post
        key={post.id}
        title={post.title}
        description={post.description}
        content={post.content}
        writtenAt={new Date(post.writtenAt)}
        userName={formatAuthorName(post.author)}
        userImageUrl={post.author?.userImageUrl}
      />
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

  const imageNode = findPostNode(
    JSON.parse(post.content) as JSONContent,
    'image'
  )
  const imageUrl = imageNode?.attrs?.src as string | undefined

  return {
    title: post.title,
    description: post.description,
    applicationName: 'Vinícius Jardim Blog',
    metadataBase: baseUrl,
    keywords: post.keywords,
    authors: { name: formatAuthorName(post.author), url: baseUrl },
    ...(imageUrl
      ? {
          twitter: {
            card: 'summary_large_image',
          },
        }
      : undefined),
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      type: 'article',
      url: `/posts/${post.slug}`,
      images: imageUrl,
    },
  }
}
