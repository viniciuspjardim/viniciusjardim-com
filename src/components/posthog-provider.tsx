'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import posthog from 'posthog-js'
import { PostHogProvider as Provider } from 'posthog-js/react'
import { env } from '~/env.mjs'

const PosthogPageView = dynamic(
  () => import('./posthog-page-view').then((module) => module.PosthogPageView),
  {
    ssr: false,
  }
)

export function PosthogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
    })
  }, [])

  return (
    <Provider client={posthog}>
      <PosthogPageView />
      {children}
    </Provider>
  )
}
