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
  const analysisData = [
    {
      name: 'Summary',
      value: '',
    },
    {
      name: 'Subject',
      value: '',
    },
    {
      name: 'Mood',
      value: '',
    },
    {
      name: 'Negative',
      value: 'False',
    },
  ]
  return (
    <div className="p-2 gap-2 h-full w-full grid grid-cols-3 bg-zinc-400/10 h-full rounded-lg shadow-md shadow-black/40 w-full">
      <div className="col-span-2">
        <Editor entry={entry as JournalEntry} />
      </div>
      <div className="rounded-md px-3 shadow-md shadow-black/40 py-5">
        <h2 className="font-semibold bg-blue-300/20 rounded-md p-3 text-blue-600 font-mono text-xl text-center">
          Analysis
        </h2>
        <div>
          <ul>
            {analysisData?.map((item) => {
              return (
                <li
                  key={item?.name}
                  className="flex px-2 py-2 font-mono items-center justify-between border-b border-t border-black/20"
                >
                  <span className="text-lg font-semibold">{item?.name}</span>
                  <span>{item?.value}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EntryPage
