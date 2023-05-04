import Head from 'next/head'
import { useUser } from '@clerk/nextjs'

import { Header } from '~/components/Header'
import { Button } from '~/components/Button'
import { useState } from 'react'

export default function ManageCachePage() {
  const { user } = useUser()
  const [status, setStatus] = useState('')

  const revalidatePath = async (path: string) => {
    setStatus('loading...')

    try {
      const response = await fetch(
        `/api/revalidate/path?path=${encodeURIComponent(path)}`
      )

      if (!response.ok) throw new Error(`Failed to revalidate "${path}"`)

      return setStatus(`cache cleared for "${path}"`)
    } catch (error) {
      if (error instanceof Error) {
        return setStatus(error.message || 'error')
      }
      return setStatus('error')
    }
  }

  if (!user) {
    return (
      <>
        <Header />

        <div className="flex flex-col items-center space-y-8 py-4">
          <h1 className="text-3xl">Manage Caches</h1>

          <div className="flex w-full max-w-3xl justify-center px-2">
            <p className="rounded-r-md border-l-4 border-rose-500 bg-slate-900/75 p-4 text-base">
              <strong>Info:</strong> Please sign in to manage the caches.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Vinícius Jardim | Manage Caches</title>
        <meta name="description" content="Vinícius Jardim's personal site" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Header />

      <div className="flex flex-col items-center space-y-8 py-4">
        <h1 className="text-3xl">Manage Caches</h1>

        <main className="flex w-full max-w-3xl flex-col items-center space-y-6 px-2">
          <Button onClick={() => revalidatePath('/')}>
            Clear Home Page Cache
          </Button>

          <p className="w-full rounded-md bg-black/40 p-4 font-mono text-base text-white/70 md:text-lg">
            <strong>Status:</strong> {status}
          </p>
        </main>
      </div>
    </>
  )
}
