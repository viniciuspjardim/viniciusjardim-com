import { useState } from 'react'
import { NodeSelection } from 'prosemirror-state'
import { ImageIcon } from 'lucide-react'
import { type Editor } from '~/hooks/use-editor'
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
import { type ImageAttributes } from '~/helpers/tiptap-image'
import { UploadButton } from '~/utils/uploadthing'

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
      return { ...node.attrs } as ImageAttributes
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
  const [error, setError] = useState('')

  const resetState = () => {
    setIsOpen(false)
    setImageSrc('')
    setImageAlt('')
    setImageWidth('')
    setImageHeight('')
    setError('')
  }

  const addImage = () => {
    if (!editor || !imageSrc) {
      return
    }

    const attributes: ImageAttributes = {
      src: imageSrc,
      alt: imageAlt ? imageAlt : undefined,
      width: imageWidth ? imageWidth : undefined,
      height: imageHeight ? imageHeight : undefined,
    }

    editor.chain().focus().setImage(attributes).run()
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
            setImageWidth(attributes?.width || '')
            setImageHeight(attributes?.height || '')
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
          <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-md border border-neutral-800 bg-neutral-900">
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="h-48 object-contain"
                src={imageSrc}
                alt={imageAlt}
              />
            ) : (
              <UploadButton
                appearance={{
                  button: 'bg-blue-900',
                  allowedContent: 'text-neutral-300',
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImageSrc(res?.[0]?.ufsUrl ?? '')
                }}
                onUploadError={(error: Error) => {
                  setError(error.message || 'Unexpected error')
                }}
              />
            )}
            {error && (
              <span className="absolute bottom-0 block text-balance p-2 text-center text-sm text-red-500">
                {error}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="imageSrc">
                Image URL (<code>src</code>):
              </Label>
              <Button
                className="h-auto p-1"
                variant="link"
                onClick={() => {
                  setImageSrc('')
                  setError('')
                }}
              >
                Clear
              </Button>
            </div>
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
