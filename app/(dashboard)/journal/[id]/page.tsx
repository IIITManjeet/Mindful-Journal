import Editor from '@/components/Editor'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { JournalEntry } from '@prisma/client'

const getEntry = async (id: string) => {
  const user = await getUserByClerkID()
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
  })

  return entry
}

const EntryPage = async ({ params }: any) => {
  const entry = await getEntry(params?.id)
  return (
    <div className="p-5 bg-zinc-400/10 h-full rounded-lg shadow-md shadow-black/40 w-full">
      <Editor entry={entry as JournalEntry} />
    </div>
  )
}

export default EntryPage
