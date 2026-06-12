export interface HeatDay {
  key: string
  label: string
  color: string | null
  count: number
  future: boolean
}

const MoodHeatmap = ({ days }: { days: HeatDay[] }) => {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="grid grid-flow-col grid-rows-7 gap-1.5">
        {days.map((d) => {
          const base =
            'h-3.5 w-3.5 rounded-[4px] transition hover:ring-2 hover:ring-sage-300'
          if (d.future) {
            return <span key={d.key} className="h-3.5 w-3.5" />
          }
          if (d.count > 0 && d.color) {
            return (
              <span
                key={d.key}
                className={base}
                style={{ backgroundColor: d.color }}
                title={`${d.label} · ${d.count} ${
                  d.count === 1 ? 'entry' : 'entries'
                }`}
              />
            )
          }
          return (
            <span
              key={d.key}
              className={`${base} bg-cream-200`}
              title={`${d.label} · no entry`}
            />
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-ink-soft">
        <span>Each square is a day — colored by that day’s mood.</span>
        <span className="ml-auto inline-block h-3 w-3 rounded-[4px] bg-cream-200" />
        <span>none</span>
        <span className="inline-block h-3 w-3 rounded-[4px] bg-sage-400" />
        <span>logged</span>
      </div>
    </div>
  )
}

export default MoodHeatmap
