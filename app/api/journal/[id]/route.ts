import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { JournalEntry } from '@prisma/client'
import { NextResponse } from 'next/server'

export const PATCH = async (req: Request, { params }: { params: any }) => {
  const { content } = await req?.json()
  const user = await getUserByClerkID()
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user?.id,
        id: params.id,
      },
    },
    data: {
      content,
    },
  })
  return NextResponse.json({ data: updatedEntry })
}
