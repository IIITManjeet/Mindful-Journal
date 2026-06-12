import Editor from '@/components/Editor'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { JournalEntry } from '@prisma/client'
import Link from 'next/link'

const getEntry = async (id: string) => {
  const user = await getUserByClerkID()
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  })

  return entry
}

const EntryPage = async ({ params }: any) => {
  const entry = await getEntry(params?.id)

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col animate-fade-in-up">
      <Link
        href="/journal"
        className="mb-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
      >
        ← Back to entries
      </Link>
      <div className="min-h-0 flex-1">
        <Editor entry={entry as JournalEntry} />
      </div>
    </div>
  )
}

export default EntryPage
