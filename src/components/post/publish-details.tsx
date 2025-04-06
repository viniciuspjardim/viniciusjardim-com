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
      outline: 'border-y border-dashed border-neutral-800 py-2',
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
  audioUrl?: string
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
}: PublishDetailsProps) => {
  const hasUserName = userName !== authorFallback

  return (
    <div className={cn(publishDetailsVariants({ variant, className }))}>
      <div className="flex gap-3">
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
