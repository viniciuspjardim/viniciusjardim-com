'use client'

import { Button } from '~/components/ui/button'

import { cn } from '~/lib/utils'

export function AuthButton({ className }: { className?: string }) {
  return (
    <Button
      className={cn('w-24', className)}
      variant="outline"
      size="sm"
      disabled
    >
      Loading...
    </Button>
  )
}
