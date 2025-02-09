import { cn } from '~/helpers/cn'
import { Button, type ButtonProps } from '~/components/ui/button'

export function EditorButton(props: ButtonProps) {
  return (
    <Button
      className={cn('p-1', props.className)}
      variant="outline"
      size="sm"
      type="button"
      {...props}
    />
  )
}
