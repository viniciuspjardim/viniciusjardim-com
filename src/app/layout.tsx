import '~/styles/globals.css'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PosthogProvider } from '~/components/posthog-provider'

export const metadata = {
  title: 'Vinícius Jardim',
  description: 'Vinícius Jardim blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="gutter-stable dark">
      <body>
        <PosthogProvider>{children}</PosthogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
