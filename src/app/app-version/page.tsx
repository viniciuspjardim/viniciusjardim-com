import 'server-only'

import Link from 'next/link'

import { env } from '~/env'
import { WidthContainer } from '~/components/width-container'

export default function AppVersionPage() {
  return (
    <WidthContainer className="flex w-full flex-col items-center py-16">
      <div className="space-y-6 text-center text-lg">
        <nav className="pb-8">
          <Link
            className="font-semibold text-white underline decoration-rose-800 underline-offset-4 transition-all hover:text-rose-600"
            href="/"
          >
            Home
          </Link>
        </nav>
        <div>
          <span className="block text-neutral-400">Build at:</span>
          <span className="block">{new Date().toISOString()}</span>
        </div>
        <div>
          <span className="block text-neutral-400">Deploy branch:</span>
          <span className="block">{env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}</span>
        </div>
        <div>
          <span className="block text-neutral-400">Commit hash:</span>
          <span className="block">{env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}</span>
        </div>
        <div>
          <span className="block text-neutral-400">Environment:</span>
          <span className="block">{env.NEXT_PUBLIC_VERCEL_VERCEL_ENV}</span>
        </div>
      </div>
    </WidthContainer>
  )
}
