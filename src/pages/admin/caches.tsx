import { useUser } from '@clerk/nextjs'

import { PageHead } from '~/components/page-head'
import { Navbar } from '~/components/navbar'
import { Button } from '~/components/button'
import { useState } from 'react'

const pageName = 'Caches (admin)'

export default function CachesAdmin() {
  const { user } = useUser()
  const [status, setStatus] = useState('')

  const revalidatePath = async (path: string) => {
    setStatus('loading...')

    try {
      const response = await fetch(
        `/api/revalidate/path?path=${encodeURIComponent(path)}`
      )

      if (!response.ok) throw new Error(`Failed to revalidate "${path}"`)

      return setStatus(`cache cleared for "${path}".`)
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
        <PageHead page={pageName} />

        <Navbar />

        <div className="flex flex-col items-center space-y-8 py-4">
          <h1 className="text-3xl">{pageName}</h1>

          <div className="flex w-full max-w-3xl justify-center px-2">
            <p className="rounded-r-md border-l-4 border-orange-300 bg-slate-900/75 p-4 text-base">
              <strong>Info:</strong> please sign in to access {pageName}.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHead page={pageName} />

      <Navbar />

      <div className="flex flex-col items-center space-y-8 py-4">
        <h1 className="text-3xl">{pageName}</h1>

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
