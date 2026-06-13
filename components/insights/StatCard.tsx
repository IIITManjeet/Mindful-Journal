interface props {
  label: string
  value: string | number
  hint?: string
  accent?: string
}

const StatCard = ({ label, value, hint, accent }: props) => {
  return (
    <div className="rounded-2xl border border-line bg-cream-50 p-4 shadow-calm transition duration-300 hover:-translate-y-0.5 hover:shadow-calm-lg sm:p-5">
      <div className="mb-1 flex items-center gap-2">
        {accent && (
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
        )}
        <span className="text-sm font-medium text-ink-muted">{label}</span>
      </div>
      <p
        className="font-serif text-2xl font-semibold capitalize text-ink sm:text-3xl"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}

export default StatCard
