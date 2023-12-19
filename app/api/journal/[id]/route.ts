import { analyze } from '@/utils/ai'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { Analysis } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
interface props {
  params: any
}
export const PATCH = async (request: Request, { params }: props) => {
  const { content } = await request.json()
  const user = await getUserByClerkID()
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    data: {
      content,
    },
  })

  const analysis = await analyze(updatedEntry.content)
  const update = await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    create: {
      entryId: updatedEntry.id,
      ...analysis,
    } as Analysis,
    update: analysis as Analysis,
  })
  console.log(update)
  return NextResponse.json({ data: updatedEntry })
}

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
