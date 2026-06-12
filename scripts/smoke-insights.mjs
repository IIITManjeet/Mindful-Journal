// End-to-end smoke test for the Insights pipeline.
// Seeds a throwaway user + entries, runs REAL Gemini analysis (with the new
// sentimentScore), then computes the same stats the /insights page computes,
// and finally deletes everything it created.
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    mood: { type: SchemaType.STRING },
    subject: { type: SchemaType.STRING },
    negative: { type: SchemaType.BOOLEAN },
    summary: { type: SchemaType.STRING },
    color: {
      type: SchemaType.STRING,
      description:
        'a hexadecimal color code (and nothing else). MUST start with "#" and be 6 hex digits, e.g. "#facc15". Never return a color name.',
    },
    sentimentScore: {
      type: SchemaType.INTEGER,
      description:
        'the sentiment rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.',
    },
  },
  required: ['mood', 'subject', 'negative', 'summary', 'color', 'sentimentScore'],
}

const NAMED = { red: '#ef4444', orange: '#f97316', yellow: '#facc15', gold: '#eab308', green: '#22c55e', teal: '#14b8a6', blue: '#3b82f6', lightblue: '#7dd3fc', indigo: '#6366f1', purple: '#a855f7', pink: '#ec4899', brown: '#a16207', grey: '#9ca3af', gray: '#9ca3af', black: '#374151', white: '#e5e7eb' }
const normalizeColor = (raw) => {
  const v = (raw || '').trim()
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return v
  return NAMED[v.toLowerCase().replace(/[\s-]/g, '')] || '#7C9885'
}

const analyze = async (content) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  })
  const r = await model.generateContent(
    `Analyze the following journal entry and capture the writer's emotional state. Be honest and specific.\n\nJournal entry:\n${content}`
  )
  const parsed = JSON.parse(r.response.text())
  const score = Math.max(-10, Math.min(10, Math.round(Number(parsed.sentimentScore) || 0)))
  return { ...parsed, color: normalizeColor(parsed.color), sentimentScore: score }
}

const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`

const daysAgo = (n) => {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return d
}

const SAMPLES = [
  { age: 0, text: 'Today was wonderful — I finished my project and celebrated with friends.' },
  { age: 1, text: 'Feeling pretty anxious about the deadline tomorrow, I could not sleep well.' },
  { age: 1, text: 'Later I calmed down, made some tea, and journaled. Felt a bit better.' },
  { age: 3, text: 'Had an argument with a close friend. Feeling drained and sad tonight.' },
  { age: 5, text: 'Went for a long run this morning and felt energized and proud of myself.' },
  { age: 8, text: 'Grateful for small things today — warm sunshine and a really good coffee.' },
]

const CLERK_ID = 'smoke-test-clerk-id'
const EMAIL = 'smoke-test@example.invalid'

async function main() {
  // Clean any leftover from a previous run.
  const existing = await prisma.user.findUnique({ where: { clerkId: CLERK_ID } })
  if (existing) {
    await prisma.journalEntry.deleteMany({ where: { userId: existing.id } })
    await prisma.user.delete({ where: { id: existing.id } })
  }

  const user = await prisma.user.create({
    data: { clerkId: CLERK_ID, email: EMAIL },
  })
  console.log('▶ created test user', user.id)

  const entries = []
  for (const s of SAMPLES) {
    const createdAt = daysAgo(s.age)
    const entry = await prisma.journalEntry.create({
      data: { userId: user.id, content: s.text, createdAt, updatedAt: createdAt },
    })
    const a = await analyze(s.text)
    await prisma.analysis.create({ data: { entryId: entry.id, ...a } })
    entries.push({ ...entry, analysis: a })
    console.log(
      `   • ${dateKey(createdAt)}  mood=${a.mood.padEnd(12)} sentiment=${String(
        a.sentimentScore
      ).padStart(3)}  color=${a.color}`
    )
  }

  // --- Replicate the /insights page computations ---
  const analyzed = entries
  const dayMap = new Map()
  for (const e of entries) {
    const key = dateKey(new Date(e.createdAt))
    const prev = dayMap.get(key)
    dayMap.set(key, {
      color: e.analysis.color,
      score: e.analysis.sentimentScore,
      count: (prev?.count || 0) + 1,
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streak = 0
  const cursor = new Date(today)
  if (!dayMap.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  while (dayMap.has(dateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  const avg = (
    analyzed.reduce((s, e) => s + e.analysis.sentimentScore, 0) / analyzed.length
  ).toFixed(1)

  const moodCounts = new Map()
  for (const e of analyzed) {
    const m = e.analysis.mood.toLowerCase()
    moodCounts.set(m, (moodCounts.get(m) || 0) + 1)
  }
  const dist = [...moodCounts.entries()].sort((a, b) => b[1] - a[1])

  console.log('\n=== DASHBOARD STATS (what /insights will render) ===')
  console.log('Entries:        ', entries.length)
  console.log('Current streak: ', streak, 'day(s)')
  console.log('Avg sentiment:  ', avg, '/ 10')
  console.log('Top mood:       ', dist[0][0])
  console.log('Distribution:   ', dist.map(([m, c]) => `${m}:${c}`).join(', '))
  console.log('Days with entries:', dayMap.size, '(heatmap squares lit)')

  // --- Cleanup ---
  await prisma.journalEntry.deleteMany({ where: { userId: user.id } })
  await prisma.user.delete({ where: { id: user.id } })
  console.log('\n🧹 cleaned up test data — DB is back to its original state')
}

main()
  .catch((e) => {
    console.error('SMOKE TEST FAILED:', e.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
