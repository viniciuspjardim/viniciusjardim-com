import { useState } from 'react'
import { BracesIcon } from 'lucide-react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  getSelectedCodeBlockAttributes,
  type CodeBlockAttributes,
} from '~/helpers/tiptap-code-block'

import { type TipTapEditor } from './use-tiptap-editor'
import { EditorButton } from './editor-button'

type CodeBlockDialogProps = {
  tipTapEditor: TipTapEditor
}

export function CodeBlockDialog({ tipTapEditor }: CodeBlockDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [codeLanguage, setCodeLanguage] = useState('')
  const [codeFileName, setCodeFileName] = useState('')
  const [codeShowCopyButton, setCodeShowCopyButton] = useState(false)
  const [codeGitHubUrl, setCodeGitHubUrl] = useState('')

  const resetState = () => {
    setIsOpen(false)
    setCodeLanguage('')
    setCodeFileName('')
    setCodeShowCopyButton(false)
  }

  const isDisabled = !tipTapEditor

  const addCodeBlock = () => {
    if (isDisabled) {
      return
    }

    const attributes: CodeBlockAttributes = {
      language: codeLanguage,
      fileName: codeFileName,
      showCopyButton: codeShowCopyButton,
      gitHubUrl: codeGitHubUrl,
    }

    tipTapEditor.chain().focus().setCodeBlock(attributes).run()
    resetState()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <EditorButton
          title="Code block"
          onClick={() => {
            const attributes = getSelectedCodeBlockAttributes(tipTapEditor)
            setCodeLanguage(attributes?.language || '')
            setCodeFileName(attributes?.fileName || '')
            setCodeShowCopyButton(attributes?.showCopyButton || false)
            setCodeGitHubUrl(attributes?.gitHubUrl || '')
          }}
        >
          <BracesIcon className="size-5" />
        </EditorButton>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 p-0">
        <DialogHeader>
          <DialogTitle>Code block properties</DialogTitle>
          <DialogDescription>
            Configure your code block properties.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="grid gap-4">
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
            <Checkbox
              className="size-4"
              id="codeShowCopyButton"
              checked={codeShowCopyButton}
              onCheckedChange={(checked) =>
                setCodeShowCopyButton(
                  checked === 'indeterminate' ? false : checked
                )
              }
            />
            <Label htmlFor="codeShowCopyButton">Show copy button</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="codeGitHubUrl">GitHub URL:</Label>
            <Input
              id="codeGitHubUrl"
              type="text"
              value={codeGitHubUrl}
              onChange={(event) => setCodeGitHubUrl(event.target.value)}
            />
          </div>
        </DialogBody>

        <DialogFooter aboveVirtualKeyboard>
          <Button type="button" disabled={isDisabled} onClick={addCodeBlock}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
