import '~/styles/globals.css'

import { PosthogProvider } from '~/components/posthog-provider'

export const metadata = {
  title: 'Vinícius Jardim',
  description: 'Vinícius Jardim personal blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PosthogProvider>{children}</PosthogProvider>
      </body>
    </html>
  )
}
