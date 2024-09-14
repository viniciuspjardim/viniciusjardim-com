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
    <html lang="en" className="gutter-stable dark">
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <body>
          <Navbar />
          {children}
        </body>
      </ClerkProvider>
    </html>
  )
}
