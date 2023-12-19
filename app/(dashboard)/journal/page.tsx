import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '../../../utils/db'
import NewEntryCard from '@/components/NewEntryCard'
import EntryCard from '@/components/EntryCard'
import { JournalEntry } from '@prisma/client'
import Link from 'next/link'
import { analyze } from '@/utils/ai'

const getEntries = async () => {
  const user = await getUserByClerkID()
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return entries
}

const JournalPage = async () => {
  const entries = await getEntries()
  console.log(entries)
  return (
    <div className="p-5 bg-zinc-400/10 h-full rounded-lg shadow-md shadow-black/40">
      <h2 className="text-2xl font-semibold mb-2">Jounal Entries</h2>
      <div className="grid grid-cols-3 gap-4 p-5">
        <NewEntryCard />
        {entries.map((entry: JournalEntry) => (
          <Link href={`/journal/${entry?.id}`} key={entry?.id}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  )
}
export default JournalPage
