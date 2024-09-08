'use client'

import { useUser } from '@clerk/nextjs'

import { WidthContainer } from '~/components/width-container'
import { UploadButton } from '~/utils/uploadthing'

const pageName = 'Upload'

export default function UploadAdmin() {
  const { user } = useUser()

  if (!user) {
    return (
      <WidthContainer className="space-y-8 py-12">
        <h1 className="text-3xl">{pageName}</h1>

        <p className="rounded-r-md border-l-4 border-rose-600 bg-neutral-900 p-4 text-base">
          <strong>Info:</strong> please sign in to access {pageName}.
        </p>
      </WidthContainer>
    )
  }

  return (
    <WidthContainer className="space-y-8 py-12">
      <h1 className="text-3xl">{pageName}</h1>

      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log('Success:', res)
        }}
        onUploadError={(error: Error) => {
          console.log('Error:', error.message)
        }}
      />
    </WidthContainer>
  )
}
