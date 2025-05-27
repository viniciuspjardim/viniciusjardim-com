'use client'

import { useState } from 'react'

import { CopyIcon, CheckIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <Button
      className="text-muted-foreground p-0 dark:hover:bg-transparent"
      title="Copy code"
      variant="ghost"
      size="sm"
      type="button"
      onClick={handleCopy}
    >
      {copied ? (
        <CheckIcon className="text-foreground size-5" />
      ) : (
        <CopyIcon className="size-5" />
      )}
    </Button>
  )
}
