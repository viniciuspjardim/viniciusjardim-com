import { type AppType } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

import { api } from '~/utils/api'

import '~/styles/globals.css'
import '~/styles/post.scss'

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
        {...pageProps}
      >
        <Component {...pageProps} />
      </ClerkProvider>

      <Analytics />
    </>
  )
}

export default api.withTRPC(MyApp)
