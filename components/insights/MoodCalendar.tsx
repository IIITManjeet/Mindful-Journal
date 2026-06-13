'use client'
import { useMemo, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons'

export interface DayInfo {
  color: string
  score: number
  count: number
  mood: string
}

interface Props {
  /** Map of 'YYYY-MM-DD' -> mood info for days that have entries. */
  entriesByDay: Record<string, DayInfo>
  /** Today's local date key, computed on the server for a stable first paint. */
  todayKey: string
  /** Earliest day with an entry, to bound backward navigation. */
  firstKey: string | null
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const pad = (n: number) => String(n).padStart(2, '0')
const keyOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

const MoodCalendar = ({ entriesByDay, todayKey, firstKey }: Props) => {
  const [ty, tm] = todayKey.split('-').map(Number)
  const [view, setView] = useState({ year: ty, month: tm - 1 })

  const firstMonth = useMemo(() => {
    if (!firstKey) return { year: ty, month: tm - 1 }
    const [fy, fm] = firstKey.split('-').map(Number)
    return { year: fy, month: fm - 1 }
  }, [firstKey, ty, tm])

  // Can page back as long as the view is strictly after the first entry's
  // month, and forward until we reach the current month.
  const canPrev =
    view.year > firstMonth.year ||
    (view.year === firstMonth.year && view.month > firstMonth.month)
  const canNext = !(view.year === ty && view.month === tm - 1)

  const step = (dir: -1 | 1) => {
    setView((v) => {
      const m = v.month + dir
      if (m < 0) return { year: v.year - 1, month: 11 }
      if (m > 11) return { year: v.year + 1, month: 0 }
      return { year: v.year, month: m }
    })
  }

  const { cells, logged } = useMemo(() => {
    const startWeekday = new Date(view.year, view.month, 1).getDay()
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
    const out: ({ day: number; key: string } | null)[] = []
    for (let i = 0; i < startWeekday; i++) out.push(null)
    let count = 0
    for (let d = 1; d <= daysInMonth; d++) {
      const key = keyOf(view.year, view.month, d)
      if (entriesByDay[key]) count++
      out.push({ day: d, key })
    }
    return { cells: out, logged: count }
  }, [view, entriesByDay])

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-ink">
          {MONTHS[view.month]}{' '}
          <span className="text-ink-soft">{view.year}</span>
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!canPrev}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:bg-sage-50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canNext}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:bg-sage-50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="mb-1.5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="text-center text-[11px] font-medium uppercase tracking-wide text-ink-soft"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} className="aspect-square" />

          const info = entriesByDay[cell.key]
          const isToday = cell.key === todayKey
          const isFuture = cell.key > todayKey

          const ring = isToday
            ? 'ring-2 ring-sage-500 ring-offset-1 ring-offset-cream-50'
            : ''

          if (info) {
            return (
              <div
                key={cell.key}
                title={`${cell.key} · ${info.mood} · ${info.count} ${
                  info.count === 1 ? 'entry' : 'entries'
                }`}
                style={{ backgroundColor: info.color }}
                className={`group relative flex aspect-square items-start justify-start rounded-lg p-1.5 shadow-calm transition duration-150 hover:scale-[1.06] hover:shadow-calm-lg ${ring}`}
              >
                <span className="text-xs font-semibold text-ink drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  {cell.day}
                </span>
                {info.count > 1 && (
                  <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-ink/30" />
                )}
              </div>
            )
          }

          return (
            <div
              key={cell.key}
              title={isFuture ? cell.key : `${cell.key} · no entry`}
              className={`flex aspect-square items-start justify-start rounded-lg p-1.5 transition ${
                isFuture
                  ? 'bg-transparent'
                  : 'bg-cream-200/60 hover:bg-cream-200'
              } ${ring}`}
            >
              <span
                className={`text-xs font-medium ${
                  isFuture ? 'text-ink-soft/40' : 'text-ink-soft'
                }`}
              >
                {cell.day}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
        <span>Each day is tinted by that day’s mood.</span>
        <span>
          {logged} {logged === 1 ? 'day' : 'days'} logged
        </span>
      </div>
    </div>
  )
}

export default MoodCalendar
