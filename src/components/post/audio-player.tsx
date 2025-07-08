'use client'

import { useState, useRef, useEffect } from 'react'
import { AudioLinesIcon, PlayIcon, PauseIcon, XIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Slider } from '~/components/ui/slider'

export function AnimatedAudioIcon({ isPaused }: { isPaused: boolean }) {
  const iconClasses = cn(
    'animate-move-right-100 flex size-6 shrink-0 text-rose-800',
    {
      '[animation-play-state:paused]': isPaused,
    }
  )

  return (
    <span className="inline-flex size-6 justify-start overflow-hidden rounded-full">
      <AudioLinesIcon className={iconClasses} />
      <AudioLinesIcon className={iconClasses} />
    </span>
  )
}

export function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPaused, setIsPaused] = useState(true)
  const [isFloatingPlayerOpen, setIsFloatingPlayerOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const buttonClasses = cn(
    'hover:bg-card/50 flex h-9 items-center space-x-2 rounded-full border px-3.5 text-neutral-500 transition hover:text-neutral-400',
    {
      'bg-card/50 border-neutral-700 text-neutral-300 hover:text-neutral-300':
        !isPaused,
    }
  )

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  const handlePlayPause = async () => {
    if (!audioRef.current) return

    if (audioRef.current.paused) {
      await audioRef.current.play()
      setIsFloatingPlayerOpen(true)
    } else {
      audioRef.current.pause()
    }
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current || duration === 0 || !value.length || !value[0]) {
      return
    }

    const newTime = (value[0] / 100) * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlaying={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
      />

      <button className={buttonClasses} type="button" onClick={handlePlayPause}>
        <AnimatedAudioIcon isPaused={isPaused} />
        <span className="min-w-12">{isPaused ? 'Listen' : 'Pause'}</span>
      </button>

      {/* Floating player */}
      {isFloatingPlayerOpen && (
        <div className="bg-card fixed bottom-6 left-1/2 z-50 flex w-80 -translate-x-1/2 flex-col space-y-2 rounded-full px-4 py-2 shadow-md shadow-white/10">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePlayPause}
              className="flex size-8 items-center justify-center rounded-full transition hover:bg-neutral-700 hover:text-neutral-200"
            >
              {isPaused ? (
                <>
                  <PlayIcon className="size-5" />
                  <span className="sr-only">Play</span>
                </>
              ) : (
                <>
                  <PauseIcon className="size-5" />
                  <span className="sr-only">Pause</span>
                </>
              )}
            </button>
            <span className="text-sm text-neutral-400">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 px-2">
              <Slider
                className="cursor-pointer"
                value={[progressValue]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
              />
            </div>
            <span className="text-sm text-neutral-400">
              {formatTime(duration)}
            </span>
            <button
              type="button"
              onClick={() => setIsFloatingPlayerOpen(false)}
              className="flex size-8 items-center justify-center rounded-full transition hover:bg-neutral-700 hover:text-neutral-300"
            >
              <XIcon className="size-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
