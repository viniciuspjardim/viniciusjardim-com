'use client'

import { CircleArrowUpIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'

export function GoToTopButton() {
  return (
    <Button
      className="flex h-auto items-center gap-2 p-0 transition-colors dark:text-neutral-400 dark:hover:text-white dark:hover:no-underline"
      variant="link"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }}
    >
      <span className="text-lg">Go to the top</span>
      <CircleArrowUpIcon className="size-5" />
    </Button>
  )
}
