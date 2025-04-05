'use client'

import { SignIn } from '@clerk/nextjs'
import { WidthContainer } from '~/components/width-container'

export default function SignInPage() {
  return (
    <WidthContainer className="flex w-full flex-col items-center pt-20">
      <SignIn />
    </WidthContainer>
  )
}
