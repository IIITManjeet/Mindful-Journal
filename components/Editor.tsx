'use client'
import { updateEntry } from '@/utils/api'
import { JournalEntry } from '@prisma/client'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'

interface props {
  entry: JournalEntry
}

const Editor = ({ entry }: props) => {
  const [value, setValue] = useState<string>(entry?.content)
  const [isLoading, setIsLoading] = useState<Boolean>(true)
  useAutosave({
    data: value,
    onSave: async (_value: string) => {
      const updated = await updateEntry(entry?.id, _value)
      setIsLoading(false)
    },
  })
  return (
    <div className="w-full h-full">
      {isLoading && <div>....loading</div>}
      <textarea
        className="w-full bg-zinc-400/5 focus:outline-none focus:shadow-black/40 focus:shadow-md rounded-md h-full p-5 text-md"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

export default Editor
