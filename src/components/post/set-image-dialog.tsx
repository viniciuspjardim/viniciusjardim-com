import { useState } from 'react'
import { NodeSelection } from 'prosemirror-state'
import { type Editor } from '~/hooks/use-editor'
import { ImageIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { EditorButton } from '~/components/post/editor-button'

type SetImageDialogProps = {
  editor: Editor
}

function getSelectedImageAttributes(editor: Editor) {
  if (!editor) {
    return null
  }

  const { selection } = editor.state

  if (selection instanceof NodeSelection) {
    const node = selection.node

    console.log

    if (node.type.name === 'image') {
      return { ...node.attrs } as { src: string; alt: string }
    }
  }

  return null
}

export function SetImageDialog({ editor }: SetImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageWidth, setImageWidth] = useState('')
  const [imageHeight, setImageHeight] = useState('')

  const resetState = () => {
    setIsOpen(false)
    setImageSrc('')
    setImageAlt('')
    setImageWidth('')
    setImageHeight('')
  }

  const addImage = () => {
    if (!imageSrc) {
      return
    }

    editor
      ?.chain()
      .focus()
      .setImage({
        src: imageSrc,
        alt: imageAlt ? imageAlt : undefined,
        // TODO: customize TipTap to allow images to have the width and height
        // width: imageWidth ? imageWidth : undefined,
        // height: imageHeight ? imageHeight : undefined,
      })
      .run()
    resetState()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <EditorButton
          onClick={() => {
            const attributes = getSelectedImageAttributes(editor)
            setImageSrc(attributes?.src || '')
            setImageAlt(attributes?.alt || '')
          }}
        >
          <ImageIcon />
        </EditorButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Image properties</DialogTitle>
          <DialogDescription>
            Add an image to your post by pasting a URL, and sizes below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="imageSrc">
              Image URL (<code>src</code>):
            </Label>
            <Input
              id="imageSrc"
              type="url"
              placeholder="https://abc.ufs.sh/f/tOHJ9"
              value={imageSrc}
              onChange={(event) => setImageSrc(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageAlt">
              Description (<code>alt</code>):
            </Label>
            <Input
              id="imageAlt"
              type="text"
              maxLength={200}
              placeholder="Spaceship orbiting a planet"
              value={imageAlt}
              onChange={(event) => setImageAlt(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageWidth">Width:</Label>
            <Input
              id="imageWidth"
              type="number"
              placeholder="1200"
              value={imageWidth}
              onChange={(event) => setImageWidth(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageHeight">Height:</Label>
            <Input
              id="imageHeight"
              type="number"
              placeholder="630"
              value={imageHeight}
              onChange={(event) => setImageHeight(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={addImage}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
