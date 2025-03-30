import { auth } from '@clerk/nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const getUserId = async () => {
  const { userId } = await auth()

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
    .middleware(async () => {
      const { userId } = await getUserId()
      return { userId }
    })
    .onUploadComplete(({ metadata, file }) => ({
      userId: metadata.userId,
      fileName: file.name,
      fileUrl: file.ufsUrl,
      fileSize: file.size,
    })),
} satisfies FileRouter

export type LocalFileRouter = typeof localFileRouter
