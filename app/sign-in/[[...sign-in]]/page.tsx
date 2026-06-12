import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cream px-4">
      <SignIn />
    </div>
  )
}
