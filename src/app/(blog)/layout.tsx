import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

import { Navbar } from '~/components/navbar'

import { TRPCReactProvider } from '~/trpc/react'

import '~/styles/post.scss'

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <TRPCReactProvider>
        <Navbar />
        {children}
      </TRPCReactProvider>
    </ClerkProvider>
  )
}
