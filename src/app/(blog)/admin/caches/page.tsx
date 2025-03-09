'use client'

import { useUser } from '@clerk/nextjs'

import { Button } from '~/components/ui/button'
import { WidthContainer } from '~/components/width-container'
import { useState } from 'react'

const pageName = 'Caches'

export default function CachesAdminPage() {
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
      <WidthContainer className="space-y-8 py-12">
        <h1 className="text-3xl">{pageName}</h1>

        <p className="rounded-r-md border-l-4 border-rose-600 bg-neutral-900 p-4 text-base">
          <strong>Info:</strong> please sign in to access {pageName}.
        </p>
      </WidthContainer>
    )
  }

  return (
    <WidthContainer className="space-y-8 py-12">
      <h1 className="text-3xl">{pageName}</h1>

      <Button onClick={() => revalidatePath('/')}>Clear Home Page Cache</Button>

      <p className="rounded-r-md border-l-4 border-emerald-600 bg-neutral-900 p-4 text-base">
        <strong>Info:</strong> {status}
      </p>
    </WidthContainer>
  )
}
