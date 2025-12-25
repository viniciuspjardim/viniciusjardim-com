'use client'

import { Suspense } from 'react'
import { ClerkProvider as ClerkProviderComponent } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback="Loading...">
      <ClerkProviderComponent
        appearance={{
          baseTheme: dark,
          variables: { colorBackground: '#0a0a0a' },
        }}
      >
        {children}
      </ClerkProviderComponent>
    </Suspense>
  )
}
