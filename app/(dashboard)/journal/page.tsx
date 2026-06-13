import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '../../../utils/db'
import NewEntryCard from '@/components/NewEntryCard'
import EntryCard from '@/components/EntryCard'
import Link from 'next/link'
import Question from '@/components/Question'
import Onboarding from '@/components/Onboarding'
import Greeting from '@/components/Greeting'

const getEntries = async () => {
  const user = await getUserByClerkID()
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      analysis: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return entries
}

const JournalPage = async () => {
  const entries = await getEntries()

  return (
    <div className="mx-auto max-w-6xl animate-fade-in-up">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
          <Greeting />.
        </h1>
        <p className="mt-2 text-lg text-ink-muted">
          How are you feeling today? Take a moment to reflect.
        </p>
      </header>

      {entries.length === 0 ? (
        <Onboarding />
      ) : (
        <>
          <div className="mb-8">
            <Question />
          </div>

          <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">
            Your entries
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <NewEntryCard />
            {entries.map((entry) => (
              <Link href={`/journal/${entry?.id}`} key={entry?.id}>
                <EntryCard entry={entry} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default JournalPage
