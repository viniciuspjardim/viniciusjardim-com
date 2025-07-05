'use client'

import { useState, useRef } from 'react'
import { AudioLinesIcon } from 'lucide-react'
import { cn } from '~/lib/utils'

export function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPaused, setIsPaused] = useState(true)

  const buttonClasses = cn(
    'flex h-9 items-center space-x-2 rounded-full border px-3.5 text-neutral-500 transition hover:bg-neutral-900 hover:text-neutral-400',
    {
      'border-neutral-600 bg-neutral-900 text-neutral-300 hover:text-neutral-300':
        !isPaused,
    }
  )

  const iconClasses = cn(
    'animate-move-right-100 flex size-6 shrink-0 text-rose-800',
    {
      '[animation-play-state:paused]': isPaused,
    }
  )

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlaying={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
      />
      <button
        className={buttonClasses}
        type="button"
        onClick={async () => {
          if (!audioRef.current) return

          if (audioRef.current.paused) {
            await audioRef.current.play()
          } else {
            audioRef.current.pause()
          }
        }}
      >
        <span className="inline-flex size-6 justify-start overflow-hidden rounded-full">
          <AudioLinesIcon className={iconClasses} />
          <AudioLinesIcon className={iconClasses} />
        </span>
        <span className="min-w-12">{isPaused ? 'Listen' : 'Pause'}</span>
      </button>
    </>
  )
}
