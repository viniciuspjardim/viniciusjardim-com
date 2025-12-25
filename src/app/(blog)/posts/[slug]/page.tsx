import 'server-only'

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getImageProps, type ImageProps } from 'next/image'
import { cacheLife, cacheTag } from 'next/cache'

import { db } from '~/db'
import type { Category } from '~/helpers/assemble-categories'
import { env } from '~/env'
import { Post } from '~/components/post/post'
import { WidthContainer } from '~/components/width-container'
import { findPostNode } from '~/helpers/tiptap-utils'
import { formatAuthorName } from '~/helpers/format-author-name'
import { PostBreadcrumb } from '~/components/ui/breadcrumb'
import { Skeleton } from '~/components/ui/skeleton'

async function PostContent({ slug }: { slug: string }) {
  'use cache'
  cacheLife('max')
  cacheTag('post-page')

  const [categories, post] = await Promise.all([
    db.category.getAll() as Promise<Category[]>,
    db.post.getOneBySlug(slug),
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

async function PostPageContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>
}) {
  const { slug } = await paramsPromise

  return <PostContent slug={slug} />
}

export default function PostPage(props: PageProps<'/posts/[slug]'>) {
  return (
    <WidthContainer className="w-full py-16">
      <Suspense fallback={<PostContentSkeleton />}>
        <PostPageContent paramsPromise={props.params} />
      </Suspense>
    </WidthContainer>
  )
}

export async function generateStaticParams() {
  'use cache'
  cacheLife('max')
  cacheTag('post-static-params')

  const posts = await db.post.getAll()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  'use cache'
  cacheLife('max')
  cacheTag('post-metadata')

  const { slug } = await params
  const post = await db.post.getOneBySlug(slug)
  const baseUrl = new URL(
    env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ).toString()

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
