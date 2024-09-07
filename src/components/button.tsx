import type { MouseEventHandler, ReactNode } from 'react'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}

export function Button({
  type = 'button',
  disabled,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      className="w-28 min-w-fit rounded-sm border border-neutral-500 bg-neutral-900/75 px-4 py-1 opacity-70 transition enabled:hover:opacity-100 disabled:cursor-not-allowed disabled:border-neutral-500/30"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
