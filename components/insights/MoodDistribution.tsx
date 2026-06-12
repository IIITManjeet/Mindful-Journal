export interface MoodSlice {
  mood: string
  count: number
  color: string
}

const MoodDistribution = ({
  slices,
  total,
}: {
  slices: MoodSlice[]
  total: number
}) => {
  if (!total) {
    return (
      <p className="text-sm text-ink-soft">
        Your moods will gather here as you write.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {slices.map((s) => {
        const pct = Math.round((s.count / total) * 100)
        return (
          <li key={s.mood} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-sm font-medium capitalize text-ink">
              {s.mood}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-200">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: s.color }}
              />
            </div>
            <span className="w-9 shrink-0 text-right text-sm text-ink-muted">
              {pct}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default MoodDistribution
