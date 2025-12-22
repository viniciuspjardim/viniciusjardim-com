import type { s } from '~/db'

import Link from 'next/link'
import Image from 'next/image'
import { PublishDetails } from './publish-details'
import { Skeleton } from '~/components/ui/skeleton'
import { findPostNode } from '~/helpers/tiptap-utils'

type PostCardProps = {
  post: s.Post
  userName: string
  userImageUrl?: string | null
  isPriorityImage?: boolean
}

export function PostCard({
  post,
  userName,
  userImageUrl,
  isPriorityImage = false,
}: PostCardProps) {
  const imageNode = findPostNode(post.content, 'image')
  const imageSrc = imageNode?.attrs?.src as string | undefined
  const imageAlt = imageNode?.attrs?.alt as string | undefined

  return (
    <Link
      className="group flex w-full flex-col items-start gap-x-8 gap-y-3 py-10 md:flex-row"
      href={`/posts/${post.slug}`}
      lang={post.lang}
    >
      {imageSrc && (
        <Image
          // Aspect ratio 16:9 - 768x432 or 320x180
          className="bg-card aspect-video w-full shrink-0 rounded-md object-cover md:w-80"
          src={imageSrc}
          alt={imageAlt ?? ''}
          priority={isPriorityImage}
          width={768}
          height={432}
          quality={80}
        />
      )}
      <div className="shrink space-y-2">
        <h2 className="text-3xl text-balance text-neutral-300 transition-colors group-hover:text-neutral-200">
          {post.title}
        </h2>
        {post.description && (
          <h3 className="text-xl text-neutral-400 transition-colors">
            {post.description}
          </h3>
        )}
        <PublishDetails
          lang={post.lang}
          writtenAt={post.writtenAt}
          userName={userName}
          userImageUrl={userImageUrl}
          isPriorityImage={isPriorityImage}
        />
      </div>
    </Link>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-x-8 gap-y-3 py-10 md:flex-row">
      <Skeleton className="aspect-video w-full shrink-0 md:w-80" />
      <div className="w-full grow space-y-4">
        <Skeleton className="h-8 w-8/12 rounded-full lg:w-6/12" />
        <Skeleton className="h-5 w-10/12 rounded-full lg:w-10/12" />
        <div className="flex gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-3 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PostCardListSkeleton() {
  return (
    <>
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </>
  )
}
