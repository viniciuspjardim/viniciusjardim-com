import Link from 'next/link'
import type { JSONContent } from '@tiptap/core'
import { PublishDetails } from './publish-details'
import { findPostNode } from '~/helpers/find-post-node'

type PostCardProps = {
  slug: string
  title: string
  description: string | null
  content: string
  writtenAt: Date
  userName: string
  userImageUrl?: string | null
}

export function PostCard({
  slug,
  title,
  description,
  content,
  writtenAt,
  userName,
  userImageUrl,
}: PostCardProps) {
  const imageNode = findPostNode(JSON.parse(content) as JSONContent, 'image')
  const imageUrl = imageNode?.attrs?.src as string | undefined

  return (
    <Link
      className="group flex w-full flex-col items-start justify-between gap-x-8 gap-y-3 py-10 first:pt-0 last:pb-0 md:flex-row"
      href={`/posts/${slug}`}
    >
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="w-full rounded-md md:w-80"
          loading="lazy"
          src={imageUrl}
          alt={imageNode?.attrs?.alt as string}
        />
      )}
      <div className="space-y-2">
        <h2 className="text-balance text-3xl font-bold text-neutral-300 transition-colors group-hover:text-neutral-100">
          {title}
        </h2>
        {description && (
          <h3 className="text-xl text-neutral-400 transition-colors group-hover:text-neutral-300">
            {description}
          </h3>
        )}
        <PublishDetails
          writtenAt={writtenAt}
          userName={userName}
          userImageUrl={userImageUrl}
        />
      </div>
    </Link>
  )
}
