import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import Link from 'next/link'
import Logo from '@/components/Logo'
import StatCard from '@/components/insights/StatCard'
import SentimentChart from '@/components/insights/SentimentChart'
import MoodCalendar, { DayInfo } from '@/components/insights/MoodCalendar'
import MoodDistribution, {
  MoodSlice,
} from '@/components/insights/MoodDistribution'

const dateKey = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const getData = async () => {
  const user = await getUserByClerkID()
  const entries = await prisma.journalEntry.findMany({
    where: { userId: user.id },
    include: { analysis: true },
    orderBy: { createdAt: 'asc' },
  })
  return entries
}

const InsightsPage = async () => {
  const entries = await getData()
  const analyzed = entries.filter((e) => e.analysis)

  // --- Per-day rollup (latest entry of a day wins its color/mood) ---
  const dayMap = new Map<string, DayInfo>()
  for (const e of entries) {
    if (!e.analysis) continue
    const key = dateKey(new Date(e.createdAt))
    const prev = dayMap.get(key)
    dayMap.set(key, {
      color: e.analysis.color,
      score: e.analysis.sentimentScore,
      mood: e.analysis.mood,
      count: (prev?.count || 0) + 1,
    })
  }

  // --- Calendar data (a plain map the client component can page through) ---
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const entriesByDay: Record<string, DayInfo> = Object.fromEntries(dayMap)
  const todayKey = dateKey(today)
  const firstKey = entries.length ? dateKey(new Date(entries[0].createdAt)) : null

  // --- Current streak (consecutive days, with a 1-day grace) ---
  let streak = 0
  const cursor = new Date(today)
  if (!dayMap.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  while (dayMap.has(dateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  // --- Average sentiment ---
  const avgSentiment = analyzed.length
    ? (
        analyzed.reduce((s, e) => s + (e.analysis!.sentimentScore || 0), 0) /
        analyzed.length
      ).toFixed(1)
    : '—'

  // --- Mood distribution + most common mood ---
  const moodCounts = new Map<string, { count: number; color: string }>()
  for (const e of analyzed) {
    const m = e.analysis!.mood.toLowerCase()
    const prev = moodCounts.get(m)
    moodCounts.set(m, {
      count: (prev?.count || 0) + 1,
      color: prev?.color || e.analysis!.color,
    })
  }
  const slices: MoodSlice[] = Array.from(moodCounts.entries())
    .map(([mood, v]) => ({ mood, count: v.count, color: v.color }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
  const topMood = slices[0]?.mood ?? '—'

  // --- Sentiment trend (most recent 30 analyzed entries) ---
  const trend = analyzed.slice(-30).map((e) => ({
    label: new Date(e.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    score: e.analysis!.sentimentScore,
  }))

  if (entries.length === 0) {
    return (
      <div className="mx-auto max-w-2xl animate-fade-in-up py-20 text-center">
        <div className="mb-5 flex justify-center">
          <Logo size={56} />
        </div>
        <h1 className="mb-2 font-serif text-3xl font-semibold text-ink">
          Your emotional weather, soon
        </h1>
        <p className="mb-6 text-ink-muted">
          Once you write a few entries, this space fills with the patterns,
          trends, and rhythms of how you’ve been feeling.
        </p>
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3 font-medium text-cream-50 shadow-calm transition hover:bg-sage-600"
        >
          Write your first entry →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl animate-fade-in-up">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Emotional weather
        </h1>
        <p className="mt-2 text-base text-ink-muted sm:text-lg">
          The patterns and rhythms of how you’ve been feeling.
        </p>
      </header>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Entries" value={entries.length} hint="moments captured" />
        <StatCard
          label="Current streak"
          value={`${streak} ${streak === 1 ? 'day' : 'days'}`}
          hint="keep it going"
        />
        <StatCard
          label="Avg. sentiment"
          value={avgSentiment}
          hint="on a -10 to 10 scale"
        />
        <StatCard
          label="Top mood"
          value={topMood}
          accent={slices[0]?.color}
          hint="most felt lately"
        />
      </div>

      {/* Calendar */}
      <section className="mb-6 rounded-2xl border border-line bg-cream-50 p-5 shadow-calm sm:p-6">
        <MoodCalendar
          entriesByDay={entriesByDay}
          todayKey={todayKey}
          firstKey={firstKey}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend */}
        <section className="rounded-2xl border border-line bg-cream-50 p-6 shadow-calm lg:col-span-2">
          <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
            Sentiment over time
          </h2>
          <SentimentChart data={trend} />
        </section>

        {/* Distribution */}
        <section className="rounded-2xl border border-line bg-cream-50 p-6 shadow-calm">
          <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
            Your moods
          </h2>
          <MoodDistribution slices={slices} total={analyzed.length} />
        </section>
      </div>
    </div>
  )
}

export default InsightsPage
