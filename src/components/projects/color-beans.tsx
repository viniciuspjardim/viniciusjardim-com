'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLinkIcon } from 'lucide-react'

import { useRouter } from 'next/navigation'

export function ColorBeans() {
  const router = useRouter()

  // TODO: better understand how to create a component that has one general link
  // in the hole component area, and other links inside it, like they YouTube video cards.

  return (
    <button
      className="mt-16 mb-6 flex w-full items-center justify-center gap-4 rounded-full border px-12 py-4 text-left transition-all hover:bg-neutral-950 sm:w-auto"
      onClick={() => router.push('/p/color-beans')}
    >
      <Link href="/p/color-beans">
        <Image
          className="pb-1"
          src="/color-beans-2-icon.png"
          alt="Color Beans logo"
          width={48}
          height={48}
        />
      </Link>
      <div>
        <Link className="block text-xl font-semibold" href="/p/color-beans">
          Play Color Beans
        </Link>
        <Link
          className="inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-neutral-300"
          href="https://github.com/viniciuspjardim/color-beans"
          target="_blank"
          onClick={(event) => event.stopPropagation()}
        >
          View on GitHub <ExternalLinkIcon className="size-3.5" />
        </Link>
      </div>
    </button>
  )
}
