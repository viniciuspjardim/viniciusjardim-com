import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

import { Header } from '~/components/Header'

import '~/styles/post.scss'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <body>
          <Header />

          <main className="flex flex-col items-center space-y-8 py-4">
            {children}
          </main>
        </body>
      </ClerkProvider>
    </html>
  )
}
