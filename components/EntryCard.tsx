import { Analysis, JournalEntry } from '@prisma/client'

interface props {
  entry: JournalEntry & { analysis: Analysis | null }
}

const EntryCard = ({ entry }: props) => {
  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const analysis = entry.analysis
  const color = analysis?.color || '#C5D6C7'

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-cream-50 shadow-calm transition duration-200 hover:-translate-y-1 hover:shadow-calm-lg">
      {/* Mood color accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink-soft">{date}</span>
          <span className="text-lg" title={analysis?.negative ? 'Heavier' : 'Lighter'}>
            {analysis?.negative ? '🌧️' : '☀️'}
          </span>
        </div>

        <p className="line-clamp-3 min-h-[3.75rem] text-[15px] leading-relaxed text-ink/80">
          {analysis?.summary || 'A fresh page, waiting for your words…'}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-cream"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium capitalize text-ink">
            {analysis?.mood || 'unwritten'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default EntryCard
