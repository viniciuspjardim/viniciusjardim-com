'use client'

import { api } from '~/utils/api'

function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}

export default api.withTRPC(AdminLayout)
