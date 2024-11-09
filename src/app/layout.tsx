import '~/styles/globals.css'

import { type Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { TRPCReactProvider } from '~/trpc/react'

export const metadata: Metadata = {
  title: 'Vinícius Jardim - Blog',
  description: 'Vinícius Jardim personal blog (draft)',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
      <Analytics />
    </html>
  )
}
