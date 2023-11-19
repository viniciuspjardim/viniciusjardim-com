import { generateComponents } from '@uploadthing/react'
import type { LocalFileRouter } from '~/app/api/uploadthing/core'

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<LocalFileRouter>()
