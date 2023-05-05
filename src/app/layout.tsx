import { Analytics } from '@vercel/analytics/react'
import { ClerkProvider } from '@clerk/nextjs/app-beta'
import { dark } from '@clerk/themes'

import { Header } from '~/components/Header'

import '~/styles/globals.css'
import '~/styles/post.scss'

export const metadata = {
  title: 'Vinícius Jardim',
  description: 'Vinícius Jardim - blog (draft)',
}

export default function RootLayout({
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
            <Analytics />
          </main>
        </body>
      </ClerkProvider>
    </html>
  )
}
