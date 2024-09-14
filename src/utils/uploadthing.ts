import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react'

import type { LocalFileRouter } from '~/app/api/uploadthing/core'

export const UploadButton = generateUploadButton<LocalFileRouter>()
export const UploadDropzone = generateUploadDropzone<LocalFileRouter>()
