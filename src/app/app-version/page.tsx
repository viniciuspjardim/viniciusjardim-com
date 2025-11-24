import 'server-only'

import { cacheLife } from 'next/cache'
import Link from 'next/link'
import { Suspense } from 'react'

import { env } from '~/env'
import { WidthContainer } from '~/components/width-container'

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-neutral-400">{children}</span>
}

function Value({ children }: { children: React.ReactNode }) {
  return <span className="block font-semibold">{children}</span>
}

async function SystemInfo() {
  'use cache'
  cacheLife('seconds')

  const baseUrl = env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  const response = await fetch(`${baseUrl}/api/system-info`)
  const { date, bunVersion } = (await response.json()) as {
    date: string
    bunVersion: string
  }

  return (
    <>
      <div>
        <Label>Server date:</Label>
        <Value>{date}</Value>
      </div>
      <div>
        <Label>Bun version:</Label>
        <Value>{bunVersion}</Value>
      </div>
    </>
  )
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
          <Label>Build at:</Label>
          <Value>{new Date().toISOString()}</Value>
        </div>
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
        <Suspense fallback="Loading...">
          <SystemInfo />
        </Suspense>
      </div>
    </WidthContainer>
  )
}
