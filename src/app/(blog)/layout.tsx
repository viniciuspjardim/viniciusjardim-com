import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

import { Navbar } from '~/components/navbar'

import '~/styles/post.scss'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <Navbar />
      {children}
    </ClerkProvider>
  )
}
