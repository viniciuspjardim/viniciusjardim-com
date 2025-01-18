import type { JSONContent } from '@tiptap/core'

import Image from 'next/image'
import Link from 'next/link'

import { JsonParser } from './json-parser'

type PostProps = {
  slug: string
  title: string
  description: string | null
  content: string
  writtenAt: Date
  userName: string
  userImageUrl?: string | null
}

export function Post({
  slug,
  title,
  description,
  content,
  writtenAt,
  userName,
  userImageUrl,
}: PostProps) {
  const jsonContent = JSON.parse(content) as JSONContent

  return (
    <article className="w-full space-y-6">
      <div className="space-y-2">
        <Link
          className="decoration-rose-800 underline-offset-4 hover:underline"
          href={`/posts/${slug}`}
        >
          <h2 className="text-balance text-4xl font-bold text-neutral-300 md:text-5xl">
            {title}
          </h2>
        </Link>

        {description && (
          <p className="text-xl text-neutral-400 md:text-2xl">{description}</p>
        )}
      </div>

      <div className="mb-12 flex gap-3 border-y border-dashed border-neutral-800 py-3">
        {userImageUrl && (
          <Image
            className="mt-1 h-10 w-10 rounded-full"
            src={userImageUrl}
            alt={userName}
            width={40}
            height={40}
            quality={100}
          />
        )}

        <div>
          <p className="text-md font-semibold text-rose-800">{userName}</p>
          <p className="text-sm">{writtenAt.toLocaleDateString()}</p>
        </div>
      </div>

      <JsonParser {...jsonContent} />
    </article>
  )
}
