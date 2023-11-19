import { auth } from '@clerk/nextjs'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const getUserId = () => {
  const { userId } = auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  return { userId }
}

export const localFileRouter = {
  imageUploader: f({
    image: { maxFileSize: '8MB' },
    video: { maxFileSize: '32MB' },
  })
    .middleware(() => {
      const { userId } = getUserId()
      return { userId }
    })
    .onUploadComplete(({ metadata, file }) => ({
      userId: metadata.userId,
      fileName: file.name,
      fileUrl: file.url,
      fileSize: file.size,
    })),
} satisfies FileRouter

export type LocalFileRouter = typeof localFileRouter
