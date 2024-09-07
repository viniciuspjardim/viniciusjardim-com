import * as React from 'react'

import { cn } from '~/helpers/cn'

export function WidthContainer({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('mx-auto max-w-6xl px-4 md:px-10', className)}>
      {children}
    </div>
  )
}
