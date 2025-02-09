import Link from 'next/link'
import Image from 'next/image'
import type { JSONContent } from '@tiptap/core'
import { PublishDetails } from './publish-details'
import { findPostNode } from '~/helpers/find-post-node'

type PostCardProps = {
  slug: string
  title: string
  description: string | null
  content: string
  lang: string
  writtenAt: Date
  userName: string
  userImageUrl?: string | null
}

export function PostCard({
  slug,
  title,
  description,
  content,
  lang,
  writtenAt,
  userName,
  userImageUrl,
}: PostCardProps) {
  const imageNode = findPostNode(JSON.parse(content) as JSONContent, 'image')
  const imageSrc = imageNode?.attrs?.src as string | undefined
  const imageAlt = imageNode?.attrs?.alt as string | undefined

  return (
    <Link
      className="group flex w-full flex-col items-start gap-x-8 gap-y-3 py-10 first:pt-0 last:pb-0 md:flex-row"
      href={`/posts/${slug}`}
      lang={lang}
    >
      {imageSrc && (
        <>
          <Image
            className="w-full rounded-md bg-neutral-950 md:h-[10.5rem] md:w-80"
            src={imageSrc}
            alt={imageAlt ?? ''}
            width={768}
            height={404}
            quality={90}
          />
        </>
      )}
      <div className="shrink space-y-2">
        <h2 className="text-balance text-3xl font-bold text-neutral-300 transition-colors group-hover:text-neutral-200">
          {title}
        </h2>
        {description && (
          <h3 className="text-xl text-neutral-400 transition-colors">
            {description}
          </h3>
        )}
        <PublishDetails
          lang={lang}
          writtenAt={writtenAt}
          userName={userName}
          userImageUrl={userImageUrl}
        />
      </div>
    </Link>
  )
}
