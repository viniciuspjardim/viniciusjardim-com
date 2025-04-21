import { useState } from 'react'
import { BracesIcon } from 'lucide-react'
import { type Editor } from '~/hooks/use-editor'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { EditorButton } from '~/components/post/editor-button'

export type CodeBlockAttributes = {
  language: string
}

function getSelectedCodeBlockAttributes(editor: Editor) {
  const $from = editor?.state.selection.$from

  if (!$from) {
    return null
  }

  // Check selected going up to parents until we find a codeBlock node
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth)
    if (node.type.name === 'codeBlock') {
      return node.attrs as CodeBlockAttributes
    }
  }

  return null
}

type CodeBlockDialogProps = {
  editor: Editor
}

export function CodeBlockDialog({ editor }: CodeBlockDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState('')

  const resetState = () => {
    setIsOpen(false)
    setCodeLanguage('')
  }

  const isDisabled = !editor

  const addCodeBlock = () => {
    if (isDisabled) {
      return
    }

    const attributes: CodeBlockAttributes = {
      language: codeLanguage,
    }

    editor.chain().focus().setCodeBlock(attributes).run()
    resetState()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <EditorButton
          title="Code block"
          onClick={() => {
            const attributes = getSelectedCodeBlockAttributes(editor)
            setCodeLanguage(attributes?.language || '')
          }}
        >
          <BracesIcon className="size-5" />
        </EditorButton>
      </DialogTrigger>
      <DialogContent className="bg-card flex max-h-svh flex-col gap-0 rounded-md p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>Code block properties</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="codeLanguage">Language:</Label>
            <Input
              id="codeLanguage"
              type="text"
              value={codeLanguage}
              onChange={(event) => setCodeLanguage(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-5">
          <Button type="button" disabled={isDisabled} onClick={addCodeBlock}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
