import 'server-only'

import Link from 'next/link'
import { env } from '~/env'
import { WidthContainer } from '~/components/width-container'

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-neutral-400">{children}</span>
}

function Value({ children }: { children: React.ReactNode }) {
  return <span className="block font-semibold">{children}</span>
}

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
          <Label>Deploy branch:</Label>
          <Value>{env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}</Value>
        </div>
        <div>
          <Label>Commit message:</Label>
          <Value>{env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}</Value>
        </div>
        <div>
          <Label>Commit hash:</Label>
          <Value>{env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}</Value>
        </div>
        <div>
          <Label>URL:</Label>
          <Value>{env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}</Value>
        </div>
        <div>
          <Label>Environment:</Label>
          <Value>{env.NEXT_PUBLIC_VERCEL_ENV}</Value>
        </div>
        <div>
          <Label>Bun version:</Label>
          <Value>{Bun.version}</Value>
        </div>
      </div>
    </WidthContainer>
  )
}
