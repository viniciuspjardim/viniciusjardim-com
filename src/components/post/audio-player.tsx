'use client'

import { useState, useRef } from 'react'
import { AudioLinesIcon } from 'lucide-react'
import { cn } from '~/helpers/cn'

export function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPaused, setIsPaused] = useState(true)

  const iconsClassNames = cn(
    'animate-move-right-100 size-6 shrink-0 text-rose-800',
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
        className="flex items-center space-x-2 rounded-full px-3 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-400"
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
          <AudioLinesIcon className={iconsClassNames} />
          <AudioLinesIcon className={iconsClassNames} />
        </span>
        <span>{isPaused ? 'Listen' : 'Pause'}</span>
      </button>
    </>
  )
}
