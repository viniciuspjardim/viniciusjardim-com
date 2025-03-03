'use client'

import { useState, useRef } from 'react'
import { AudioLinesIcon } from 'lucide-react'
import { cn } from '~/helpers/cn'

export function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPaused, setIsPaused] = useState(true)

  const buttonClasses = cn(
    'flex h-10 items-center space-x-2 rounded-full border border-transparent px-4 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-400',
    {
      'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-neutral-300':
        !isPaused,
    }
  )

  const iconClasses = cn(
    'flex size-6 shrink-0 animate-move-right-100 text-rose-800',
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
