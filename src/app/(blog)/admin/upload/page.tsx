'use client'

import { WidthContainer } from '~/components/width-container'
import { UploadButton } from '~/utils/uploadthing'

const pageName = 'Upload'

export default function UploadAdmin() {
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
