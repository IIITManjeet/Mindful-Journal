'use client'
import { createNewEntry } from '@/utils/api'
import { useRouter } from 'next/navigation'
import React from 'react'

const NewEntryCard = () => {
  const router = useRouter()
  const handleOnClick = async () => {
    const data = await createNewEntry()
    router.push(`/journal/${data?.id}`)
  }
  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg"
      onClick={handleOnClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="text-xl">New Entry</span>
      </div>
    </div>
  )
}

export default NewEntryCard
