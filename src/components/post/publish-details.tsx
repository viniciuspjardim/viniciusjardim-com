import Image from 'next/image'
import { Clock3Icon, LanguagesIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { formatDateDistance, formatDateTime } from '~/helpers/dates'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover'

import { cn } from '~/helpers/cn'
import { authorFallback } from '~/helpers/format-author-name'

const publishDetailsVariants = cva('mb-12 flex gap-3', {
  variants: {
    variant: {
      default: '',
      outline: 'py-2 border-y border-dashed border-neutral-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface PublishDetailsProps
  extends VariantProps<typeof publishDetailsVariants> {
  className?: string
  lang: string
  writtenAt: Date
  userName: string
  userImageUrl?: string | null
}

const renderFlag = (lang: string) => {
  switch (lang) {
    case 'en-US':
      return '🇺🇸'
    case 'pt-BR':
      return '🇧🇷'
    default:
      return lang
  }
}

const PublishDetails = ({
  className,
  variant,
  lang,
  writtenAt,
  userName,
  userImageUrl,
}: PublishDetailsProps) => {
  const hasUserName = userName !== authorFallback

  return (
    <div className={cn(publishDetailsVariants({ variant, className }))}>
      {userImageUrl && (
        <Image
          className="mt-1 h-10 w-10 rounded-full bg-neutral-950"
          src={userImageUrl}
          alt={userName}
          width={40}
          height={40}
          quality={100}
        />
      )}

      <div>
        <span
          className={`text-md block font-semibold ${hasUserName ? 'text-rose-800' : 'text-neutral-500'} `}
        >
          {userName}
        </span>

        <Popover>
          <PopoverTrigger>
            <span className="inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-400">
              <LanguagesIcon className="size-3.5" />
              <span className="pt-0.5">{renderFlag(lang)}</span>
              <Clock3Icon className="ml-2 size-3.5" />
              {formatDateDistance(writtenAt)}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-auto py-2 text-sm">
            <span className="text-neutral-500">Language:</span>{' '}
            <span className="text-neutral-300">{lang}</span>{' '}
            <span className="text-neutral-500">· Published:</span>{' '}
            <span className="text-neutral-300">
              {formatDateTime(writtenAt)}
            </span>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
PublishDetails.displayName = 'PublishDetails'

export { PublishDetails, publishDetailsVariants }
