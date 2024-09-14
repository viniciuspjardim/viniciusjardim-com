import type { JSONContent } from '@tiptap/core'

import Image from 'next/image'
import Link from 'next/link'

import { JsonParser } from './json-parser'

type PostProps = {
  slug: string
  title: string
  content: string
  writtenAt: Date
  userName: string
  userImageUrl?: string | null
}

export function Post({
  slug,
  title,
  content,
  writtenAt,
  userName,
  userImageUrl,
}: PostProps) {
  const jsonContent = JSON.parse(content) as JSONContent

  return (
    <article className="w-full space-y-4">
      <Link
        className="decoration-rose-800 hover:underline"
        href={`/posts/${slug}`}
      >
        <h2 className="text-2xl font-bold text-neutral-300 md:text-4xl">
          {title}
        </h2>
      </Link>

      <div className="flex gap-3">
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

      <JsonParser className="" {...jsonContent} />
    </article>
  )
}
