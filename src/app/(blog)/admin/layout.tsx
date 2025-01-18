'use client'

import { Toaster } from '~/components/ui/toaster'
import { api } from '~/utils/api'

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

export default api.withTRPC(AdminLayout)
