import Editor from '@/components/Editor'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { Analysis, JournalEntry } from '@prisma/client'

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
  interface props {
    mood: string
    summary: string
    color: string
    subject: string
    negative: Boolean
  }
  const {
    mood,
    summary,
    color,
    subject,
    negative,
  }: props = entry?.analysis as Analysis
  const analysisData = [
    {
      name: 'Summary',
      value: summary,
    },
    {
      name: 'Subject',
      value: subject,
    },
    {
      name: 'Mood',
      value: mood,
    },
    {
      name: 'Negative',
      value: negative ? 'True' : 'False',
    },
  ]
  return (
    <div className="p-2 gap-2 h-full w-full grid grid-cols-3 bg-zinc-400/10 h-full rounded-lg shadow-md shadow-black/40 w-full">
      <div className="col-span-2">
        <Editor entry={entry as JournalEntry} />
      </div>
      <div className="rounded-md px-3 shadow-md shadow-black/40 py-5">
        <h2
          className="font-semibold rounded-md p-3 text-blue-600 font-mono text-xl text-center"
          style={{ backgroundColor: color }}
        >
          Analysis
        </h2>
        <div>
          <ul>
            {analysisData?.map((item) => {
              return (
                <li
                  key={item?.name}
                  className="flex gap-3 px-2 py-2 font-mono items-center justify-between border-b border-t border-black/20"
                >
                  <span className="text-md font-semibold">{item?.name}</span>
                  <span className="text-[14px] text-left">{item?.value}</span>
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
