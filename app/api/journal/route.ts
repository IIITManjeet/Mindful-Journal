import { analyze } from '@/utils/ai'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { Analysis } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async () => {
  const user = await getUserByClerkID()
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user?.id,
      content: 'Write about your Day!!',
    },
  })

  const analysis = await analyze(entry?.content)
  await prisma.analysis.create({
    data: {
      entryId: entry.id,
      ...analysis,
    } as Analysis,
  })

  revalidatePath('/journal')

  return NextResponse.json({ data: entry })
}
