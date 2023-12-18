import Editor from '@/components/Editor'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getEntry = async () => {
  const user = await getUserByClerkID()
  // const entry = await prisma.journalEntry.findUnique({

  // })
}

const EntryPage = ({ params }: { params: string }) => {
  return (
    <div>
      {/* <Editor /> */}
    </div>
  )
}

export default EntryPage
