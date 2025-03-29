import 'server-only'

import type { Metadata } from 'next'
import type { JSONContent } from '@tiptap/core'
import { getImageProps, type ImageProps } from 'next/image'

import { env } from '~/env'
import { Post } from '~/components/post/post'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'
import { findPostNode } from '~/helpers/tiptap-utils'
import { formatAuthorName } from '~/helpers/format-author-name'
import { PostBreadcrumb } from '~/components/ui/breadcrumb'

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [categories, post] = await Promise.all([
    api.categories.getAllFlat(),
    api.posts.getOneBySlug({ slug }),
  ])

  return (
    <WidthContainer className="w-full py-16">
      <PostBreadcrumb categories={categories} categoryId={post.categoryId} />
      <Post
        key={post.id}
        post={post}
        userName={formatAuthorName(post.author)}
        userImageUrl={post.author?.userImageUrl}
      />
    </WidthContainer>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await api.posts.getOneBySlug({ slug })
  const baseUrl = new URL(env.NEXT_PUBLIC_SITE_URL)

  const imageNode = findPostNode(
    JSON.parse(post.content) as JSONContent,
    'image'
  )
  const imageSrc = imageNode?.attrs?.src as string | undefined
  const imageWidth = imageNode?.attrs?.width as string | undefined
  const imageHeight = imageNode?.attrs?.height as string | undefined
  let imageProps: ImageProps | undefined

  if (imageSrc && imageWidth && imageHeight) {
    imageProps = getImageProps({
      src: imageSrc,
      alt: '',
      width: 1200,
      height: 630,
    }).props
  }

  return {
    title: post.title,
    description: post.description,
    applicationName: 'Vinícius Jardim Blog',
    metadataBase: baseUrl,
    keywords: post.keywords,
    authors: { name: formatAuthorName(post.author), url: baseUrl },
    ...(imageProps
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
      images: typeof imageProps?.src === 'string' ? imageProps.src : undefined,
    },
  }
}
