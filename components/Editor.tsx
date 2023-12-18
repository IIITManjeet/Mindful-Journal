'use client'

import { JournalEntry } from '@prisma/client'

interface props {
  entry: JournalEntry
}

const Editor = ({ entry }: props) => {
  return <div>{entry?.content}</div>
}

export default Editor
