'use client'
import { createNewEntry } from '@/utils/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Spinner from './Spinner'

const NewEntryCard = () => {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  const handleOnClick = async () => {
    if (creating) return
    setCreating(true)
    const data = await createNewEntry()
    router.push(`/journal/${data?.id}`)
  }

  return (
    <button
      onClick={handleOnClick}
      disabled={creating}
      className="group flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-sage-200 bg-sage-50/40 text-sage-600 transition hover:border-sage-400 hover:bg-sage-50 disabled:opacity-70"
    >
      {creating ? (
        <Spinner />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-500 text-2xl text-cream-50 shadow-calm transition group-hover:scale-110">
          +
        </span>
      )}
      <span className="font-serif text-lg font-medium">
        {creating ? 'Creating…' : 'New entry'}
      </span>
    </button>
  )
}

export default NewEntryCard
