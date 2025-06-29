import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
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
import { Textarea } from '~/components/ui/textarea'
import { EditorButton } from '~/components/post/editor-button'
import { UploadButton } from '~/utils/uploadthing'
import {
  getSelectedImageAttributes,
  type ImageAttributes,
} from '~/helpers/tiptap-image'
import { type Editor } from '~/hooks/use-editor'

type ImageDialogProps = {
  editor: Editor
}

export function ImageDialog({ editor }: ImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sourceImageHeight, setSourceImageHeight] = useState(0)
  const [sourceImageWidth, setSourceImageWidth] = useState(0)
  const [keepAspect, setKeepAspect] = useState(true)
  const [error, setError] = useState('')

  const [imageSrc, setImageSrc] = useState('')
  const [imageDescription, setImageDescription] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageIsPriority, setImageIsPriority] = useState(false)
  const [imageWidth, setImageWidth] = useState('')
  const [imageHeight, setImageHeight] = useState('')

  const resetState = () => {
    setIsOpen(false)
    setKeepAspect(true)
    setError('')

    setImageSrc('')
    setImageDescription('')
    setImageAlt('')
    setImageIsPriority(false)
    setImageWidth('')
    setImageHeight('')
  }

  const isDisabled = !editor || !imageSrc
  const imgAspect =
    sourceImageWidth && sourceImageHeight
      ? sourceImageWidth / sourceImageHeight
      : null
  const imgProperties = imgAspect
    ? `${sourceImageWidth}w X ${sourceImageHeight}h • Aspect: ${imgAspect.toFixed(4)}`
    : null

  const addImage = () => {
    if (isDisabled) {
      return
    }

    const attributes: ImageAttributes = {
      src: imageSrc,
      description: imageDescription || undefined,
      alt: imageAlt || undefined,
      isPriority: imageIsPriority || undefined,
      width: imageWidth || undefined,
      height: imageHeight || undefined,
    }

    editor.chain().focus().setImage(attributes).run()
    resetState()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <EditorButton
          title="Image"
          onClick={() => {
            const attributes = getSelectedImageAttributes(editor)
            setImageSrc(attributes?.src || '')
            setImageDescription(attributes?.description || '')
            setImageAlt(attributes?.alt || '')
            setImageIsPriority(attributes?.isPriority || false)
            setImageWidth(attributes?.width || '')
            setImageHeight(attributes?.height || '')
          }}
        >
          <ImageIcon className="size-5" />
        </EditorButton>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>Image properties</DialogTitle>
          <DialogDescription className="hidden md:block">
            Configure your code block properties.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 overflow-y-auto px-6 py-5">
          <div className="dark:bg-input/30 relative flex h-48 w-full items-center justify-center overflow-hidden rounded-md border">
            {imageSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-48 object-contain"
                  src={imageSrc}
                  alt={imageAlt}
                  onLoad={(event) => {
                    setSourceImageWidth(event.currentTarget.naturalWidth)
                    setSourceImageHeight(event.currentTarget.naturalHeight)

                    if (imageWidth || imageHeight) {
                      return
                    }
                    setImageWidth(event.currentTarget.naturalWidth.toString())
                    setImageHeight(event.currentTarget.naturalHeight.toString())
                  }}
                />
                {imgProperties && (
                  <span className="absolute right-0 bottom-0 left-0 block bg-black/80 p-2 text-center text-sm text-balance text-neutral-100">
                    {imgProperties}
                  </span>
                )}
              </>
            ) : (
              <UploadButton
                appearance={{
                  button:
                    'w-30 cursor-pointer bg-blue-900 text-white transition-colors hover:bg-blue-800',
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
              <span className="absolute bottom-0 block p-2 text-center text-sm text-balance text-red-500">
                {error}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="imageSrc">Image URL:</Label>
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
            <Label htmlFor="imageDescription">Description:</Label>
            <Textarea
              className="block w-full"
              id="imageDescription"
              maxLength={200}
              value={imageDescription}
              onChange={(event) => setImageDescription(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageAlt">Alt:</Label>
            <Textarea
              className="block w-full"
              id="imageAlt"
              maxLength={200}
              value={imageAlt}
              onChange={(event) => setImageAlt(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <div className="flex gap-2">
              <input
                className="size-4"
                type="checkbox"
                id="isPriority"
                name="isPriority"
                checked={imageIsPriority}
                onChange={(event) => setImageIsPriority(event.target.checked)}
              />
              <Label htmlFor="isPriority">Priority image</Label>
            </div>
            <p className="text-muted-foreground text-sm">
              Select this option for images that appear above the fold. The
              image will preload and won&apos;t use lazy loading.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="imageWidth">Width:</Label>
              <div className="flex gap-2">
                <input
                  className="size-4"
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
        <DialogFooter className="border-t px-6 py-5">
          <Button type="button" disabled={isDisabled} onClick={addImage}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
