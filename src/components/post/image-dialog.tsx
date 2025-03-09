import { useState } from 'react'
import { NodeSelection } from 'prosemirror-state'
import { ImageIcon } from 'lucide-react'
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
import { type ImageAttributes } from '~/helpers/tiptap-image'
import { UploadButton } from '~/utils/uploadthing'

type ImageDialogProps = {
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

export function ImageDialog({ editor }: ImageDialogProps) {
  const [imgHeight, setImgHeight] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageWidth, setImageWidth] = useState('')
  const [imageHeight, setImageHeight] = useState('')
  const [keepAspect, setKeepAspect] = useState(true)
  const [error, setError] = useState('')

  const resetState = () => {
    setIsOpen(false)
    setImageSrc('')
    setImageAlt('')
    setImageWidth('')
    setImageHeight('')
    setKeepAspect(true)
    setError('')
  }

  const isDisabled = !editor || !imageSrc
  const imgAspect = imgWidth && imgHeight ? imgWidth / imgHeight : null
  const imgProperties = imgAspect
    ? `${imgWidth}w X ${imgHeight}h • Aspect: ${imgAspect.toFixed(4)}`
    : null

  const addImage = () => {
    if (isDisabled) {
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
      <DialogContent className="flex max-h-svh flex-col gap-0 rounded-md p-0">
        <DialogHeader className="border-b border-neutral-800 px-6 py-5">
          <DialogTitle>Image properties</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 overflow-y-auto px-6 py-5">
          <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-md border border-neutral-800 bg-neutral-900">
            {imageSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-48 object-contain"
                  src={imageSrc}
                  alt={imageAlt}
                  onLoad={(event) => {
                    setImgWidth(event.currentTarget.naturalWidth)
                    setImgHeight(event.currentTarget.naturalHeight)

                    if (imageWidth || imageHeight) {
                      return
                    }
                    setImageWidth(event.currentTarget.naturalWidth.toString())
                    setImageHeight(event.currentTarget.naturalHeight.toString())
                  }}
                />
                {imgProperties && (
                  <span className="absolute bottom-0 left-0 right-0 block text-balance bg-black/80 p-2 text-center text-sm text-neutral-100">
                    {imgProperties}
                  </span>
                )}
              </>
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
                disabled={!imageSrc}
                onClick={() => {
                  setImageSrc('')
                  setImageWidth('')
                  setImageHeight('')
                  setError('')
                }}
              >
                Clear
              </Button>
            </div>
            <Input
              id="imageSrc"
              type="url"
              value={imageSrc}
              onChange={(event) => setImageSrc(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageAlt">
              Description (<code>alt</code>):
            </Label>
            <textarea
              className="block w-full"
              id="imageAlt"
              maxLength={200}
              value={imageAlt}
              onChange={(event) => setImageAlt(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="imageWidth">Width:</Label>
              <div className="flex gap-1.5">
                <input
                  type="checkbox"
                  id="ratio"
                  name="ratio"
                  checked={keepAspect}
                  onChange={(event) => setKeepAspect(event.target.checked)}
                />
                <Label htmlFor="ratio">Keep ratio</Label>
              </div>
            </div>
            <Input
              id="imageWidth"
              type="number"
              value={imageWidth}
              onChange={(event) => {
                const width = event.target.value
                setImageWidth(width)

                if (width && keepAspect && imgAspect) {
                  setImageHeight(
                    Math.round(parseInt(width, 10) / imgAspect).toString()
                  )
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageHeight">Height:</Label>
            <Input
              id="imageHeight"
              type="number"
              value={imageHeight}
              onChange={(event) => {
                const height = event.target.value
                setImageHeight(height)

                if (height && keepAspect && imgAspect) {
                  setImageWidth(
                    Math.round(parseInt(height, 10) * imgAspect).toString()
                  )
                }
              }}
            />
          </div>
        </div>
        <DialogFooter className="border-t border-neutral-800 px-6 py-5">
          <Button type="button" disabled={isDisabled} onClick={addImage}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
