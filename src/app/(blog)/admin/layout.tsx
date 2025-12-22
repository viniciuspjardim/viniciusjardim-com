'use client'

import { Suspense } from 'react'
import { Toaster } from '~/components/ui/sonner'

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback="Loading...">{children}</Suspense>
      <Toaster />
    </>
  )
}
