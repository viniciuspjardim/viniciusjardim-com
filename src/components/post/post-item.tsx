import Link from 'next/link'
import type { JSONContent } from '@tiptap/core'
import { findPostNode } from '~/helpers/find-post-node'

type PostItemProps = {
  slug: string
  title: string
  description: string | null
  content: string
}

export function PostItem({ slug, title, description, content }: PostItemProps) {
  const imageNode = findPostNode(JSON.parse(content) as JSONContent, 'image')
  const imageUrl = imageNode?.attrs?.src as string | undefined

  return (
    <Link
      className="group flex w-full flex-col items-start justify-between gap-3 transition-colors md:flex-row"
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
        <h2 className="decoration text-balance text-3xl font-bold text-neutral-300 decoration-rose-800 underline-offset-4 group-hover:underline">
          {title}
        </h2>
        {description && (
          <h3 className="text-xl text-neutral-400">{description}</h3>
        )}
      </div>
    </Link>
  )
}
