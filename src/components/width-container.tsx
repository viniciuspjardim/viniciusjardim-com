import * as React from 'react'

import { cn } from '~/lib/utils'

export function WidthContainer({
  className,
  paddingX = false,
  mdPaddingX = false,
  children,
}: {
  className?: string
  paddingX?: boolean
  mdPaddingX?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'mx-auto md:max-w-6xl',
        {
          'px-5': paddingX,
          'md:px-10': mdPaddingX,
        },
        className
      )}
    >
      {children}
    </div>
  )
}
