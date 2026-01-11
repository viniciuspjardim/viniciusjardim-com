'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLinkIcon } from 'lucide-react'

import { useRouter } from 'next/navigation'

export function ColorBeans() {
  const router = useRouter()

  return (
    <button
      className="hover:bg-card flex w-full items-center justify-center gap-4 rounded-full border px-12 py-4 text-left transition-all sm:w-auto"
      onClick={() => router.push('/p/color-beans')}
    >
      <Link href="/p/color-beans">
        <Image
          className="pb-1"
          src="/color-beans-2-icon.png"
          alt="Color Beans logo"
          loading="eager"
          fetchPriority="low"
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
