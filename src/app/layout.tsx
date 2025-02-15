import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import '~/styles/globals.css'

export const metadata = {
  title: 'Vinícius Jardim - Blog',
  description: 'Vinícius Jardim personal blog (draft)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="gutter-stable dark">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
