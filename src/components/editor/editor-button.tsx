import { cn } from '~/lib/utils'
import { Button, type ButtonProps } from '~/components/ui/button'

interface EditorButtonProps extends ButtonProps {
  isActive?: boolean
}

export function EditorButton({
  className,
  isActive = false,
  ...props
}: EditorButtonProps) {
  return (
    <Button
      className={cn(
        'min-w-9 shrink-0 p-1',
        { 'dark:border-rose-950': isActive },
        className
      )}
      variant="outline"
      size="sm"
      type="button"
      {...props}
    />
  )
}
