import { cn } from '~/helpers/cn'
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
        'min-w-8 p-1',
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
