'use client'

import { Toaster } from '~/components/ui/sonner'

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
