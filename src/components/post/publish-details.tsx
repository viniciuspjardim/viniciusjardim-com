import Image from 'next/image'
import { Clock3Icon, LanguagesIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { formatDateDistance, formatDateTime } from '~/helpers/dates'

import { cn } from '~/lib/utils'
import { authorFallback } from '~/helpers/format-author-name'
import { AudioPlayer } from './audio-player'

const publishDetailsVariants = cva('flex items-center justify-between gap-3', {
  variants: {
    variant: {
      default: '',
      outline: 'border-y px-5 py-2 md:px-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface PublishDetailsProps extends VariantProps<
  typeof publishDetailsVariants
> {
  className?: string
  lang: string
  writtenAt: Date
  userName: string
  userImageUrl?: string | null
  audioUrl?: string
  isPriorityImage?: boolean
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
  audioUrl,
  isPriorityImage = false,
}: PublishDetailsProps) => {
  const hasUserName = userName !== authorFallback

  return (
    <div className={cn(publishDetailsVariants({ variant, className }))}>
      <div className="flex gap-3">
        {userImageUrl && (
          <Image
            className="bg-card mt-1 h-10 w-10 rounded-full"
            src={userImageUrl}
            alt={userName}
            loading={isPriorityImage ? 'eager' : 'lazy'}
            fetchPriority={isPriorityImage ? 'high' : 'low'}
            width={40}
            height={40}
            quality={90}
          />
        )}

        <div>
          <span
            className={`block text-base font-semibold ${hasUserName ? 'text-rose-800' : 'text-neutral-500'} `}
          >
            {userName}
          </span>

          <span className="inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors">
            <LanguagesIcon className="size-3.5" />
            <span className="pt-0.5" title={lang}>
              {renderFlag(lang)}
            </span>
            <Clock3Icon className="ml-2 size-3.5" />
            <span title={formatDateTime(writtenAt)}>
              {formatDateDistance(writtenAt)}
            </span>
          </span>
        </div>
      </div>
      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
    </div>
  )
}
PublishDetails.displayName = 'PublishDetails'

export { PublishDetails, publishDetailsVariants }
