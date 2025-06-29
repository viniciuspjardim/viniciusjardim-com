import { useState } from 'react'
import { BracesIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { EditorButton } from '~/components/post/editor-button'
import {
  getSelectedCodeBlockAttributes,
  type CodeBlockAttributes,
} from '~/helpers/tiptap-code-block'
import { type Editor } from '~/hooks/use-editor'

type CodeBlockDialogProps = {
  editor: Editor
}

export function CodeBlockDialog({ editor }: CodeBlockDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [codeLanguage, setCodeLanguage] = useState('')
  const [codeFileName, setCodeFileName] = useState('')
  const [codeShowCopyButton, setCodeShowCopyButton] = useState(false)

  const resetState = () => {
    setIsOpen(false)
    setCodeLanguage('')
    setCodeFileName('')
    setCodeShowCopyButton(false)
  }

  const isDisabled = !editor

  const addCodeBlock = () => {
    if (isDisabled) {
      return
    }

    const attributes: CodeBlockAttributes = {
      language: codeLanguage,
      fileName: codeFileName,
      showCopyButton: codeShowCopyButton,
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
            setCodeFileName(attributes?.fileName || '')
            setCodeShowCopyButton(attributes?.showCopyButton || false)
          }}
        >
          <BracesIcon className="size-5" />
        </EditorButton>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>Code block properties</DialogTitle>
          <DialogDescription>
            Configure your code block properties.
          </DialogDescription>
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
          <div className="space-y-2">
            <Label htmlFor="codeFileName">File name:</Label>
            <Input
              id="codeFileName"
              type="text"
              value={codeFileName}
              onChange={(event) => setCodeFileName(event.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <input
              className="size-4"
              type="checkbox"
              id="codeShowCopyButton"
              name="codeShowCopyButton"
              checked={codeShowCopyButton}
              onChange={(event) => setCodeShowCopyButton(event.target.checked)}
            />
            <Label htmlFor="codeShowCopyButton">Show copy button</Label>
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
