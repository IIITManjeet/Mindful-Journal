interface props {
  label: string
  value: string | number
  hint?: string
  emoji?: string
  accent?: string
}

const StatCard = ({ label, value, hint, emoji, accent }: props) => {
  return (
    <div className="rounded-2xl border border-line bg-cream-50 p-5 shadow-calm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">{label}</span>
        {emoji && <span className="text-lg">{emoji}</span>}
      </div>
      <p
        className="font-serif text-3xl font-semibold capitalize text-ink"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}

export default StatCard
