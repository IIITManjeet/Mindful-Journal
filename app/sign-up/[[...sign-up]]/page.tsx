import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cream px-4">
      <SignUp afterSignUpUrl="/new-user" redirectUrl="/new-user" />
    </div>
  )
}
