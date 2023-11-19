'use client'

import React from 'react'
import { UploadButton } from '~/utils/uploadthing'

const pageName = 'Upload Test (admin)'

export default function UploadPage() {
  return (
    <div className="flex flex-col items-center space-y-8 py-4">
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
    </div>
  )
}
