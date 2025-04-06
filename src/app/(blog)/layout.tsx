import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

import { Navbar } from '~/components/navbar'

import { TRPCReactProvider } from '~/trpc/react'

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorBackground: '#0a0a0a' },
      }}
    >
      <TRPCReactProvider>
        <Navbar />
        {children}
      </TRPCReactProvider>
    </ClerkProvider>
  )
}
