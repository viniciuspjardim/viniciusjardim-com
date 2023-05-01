import { ClerkProvider } from '@clerk/nextjs/app-beta'
import { Header } from '~/components/Header'

import '~/styles/globals.css'
import '~/styles/post.scss'

export const metadata = {
  title: 'Vinícius Jardim',
  description: 'Vinícius Jardim blog (draft)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ClerkProvider>
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
