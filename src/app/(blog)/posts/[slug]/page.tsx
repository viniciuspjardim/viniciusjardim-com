import 'server-only'

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getImageProps, type ImageProps } from 'next/image'
import { cacheLife, cacheTag } from 'next/cache'

import type { s } from '~/db'
import type { Category } from '~/helpers/assemble-categories'
import { env } from '~/env'
import { Post } from '~/components/post/post'
import { WidthContainer } from '~/components/width-container'
import { findPostNode } from '~/helpers/tiptap-utils'
import { formatAuthorName } from '~/helpers/format-author-name'
import { PostBreadcrumb } from '~/components/ui/breadcrumb'
import { Skeleton } from '~/components/ui/skeleton'

type PostWithAuthor = s.Post & {
  author?: {
    id: string
    userName: string | null
    userImageUrl: string | null
    firstName: string | null
    lastName: string | null
  }
}

async function PostContent({ slug }: { slug: string }) {
  'use cache'
  cacheLife('max')
  cacheTag('post-page')

  const baseUrl = env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  const [categories, post] = await Promise.all([
    fetch(`${baseUrl}/api/categories/get-all`).then(
      (res) => res.json() as Promise<Category[]>
    ),
    fetch(`${baseUrl}/api/posts/get-one-by-slug/${slug}`).then(
      (res) => res.json() as Promise<PostWithAuthor>
    ),
  ])

  return (
    <>
      <PostBreadcrumb categories={categories} categoryId={post.categoryId} />
      <Post
        post={post}
        userName={formatAuthorName(post.author)}
        userImageUrl={post.author?.userImageUrl}
      />
    </>
  )
}

// TODO: improve post skeleton design better match the real post content
function PostContentSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-48 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-10/12 rounded-md" />
        <Skeleton className="h-6 w-8/12 rounded-md" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-3 w-32 rounded-full" />
        </div>
      </div>
      <div className="space-y-4 pt-6">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-11/12 rounded-full" />
        <Skeleton className="h-4 w-10/12 rounded-full" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-9/12 rounded-full" />
      </div>
    </div>
  )
}

export default async function PostPage(props: PageProps<'/posts/[slug]'>) {
  const { slug } = await props.params

  return (
    <WidthContainer className="w-full py-16">
      <Suspense fallback={<PostContentSkeleton />}>
        <PostContent slug={slug} />
      </Suspense>
    </WidthContainer>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const apiBaseUrl = env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  const post = await fetch(
    `${apiBaseUrl}/api/posts/get-one-by-slug/${slug}`
  ).then((res) => res.json() as Promise<PostWithAuthor>)
  const baseUrl = new URL(apiBaseUrl)

  const imageNode = findPostNode(post.content, 'image')
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
      quality: 80,
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
