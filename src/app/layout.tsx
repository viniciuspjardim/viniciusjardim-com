import '~/styles/globals.css'

import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PosthogProvider } from '~/components/posthog-provider'

export const metadata: Metadata = {
  title: 'Vinícius Jardim',
  description: 'Vinícius Jardim blog',
}

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${roboto.className} dark`}>
      <body>
        <PosthogProvider>{children}</PosthogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
