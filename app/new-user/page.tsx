import { prisma } from '../../utils/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const createNewUser = async () => {
  const user = await currentUser()
  console.log(user)

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user?.id as string,
    },
  })

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user?.id as string,
        email: user?.emailAddresses[0].emailAddress as string,
      },
    })
  }

  redirect('/journal')
}

const NewUser = async () => {
  await createNewUser()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream text-ink">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage-500 border-t-transparent" />
      <p className="font-serif text-lg text-ink-muted">
        Preparing your calm space…
      </p>
    </div>
  )
}

export default NewUser
