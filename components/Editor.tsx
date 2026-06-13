'use client'
import { updateEntry } from '@/utils/api'
import { update } from '@/utils/action'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAutosave } from 'react-autosave'
import Spinner from './Spinner'

const AUTOSAVE_KEY = 'mj-autosave'

const Editor = ({ entry }: { entry: any }) => {
  const [value, setValue] = useState<string>(entry?.content ?? '')
  // The last content we know is persisted — used to detect unsaved changes.
  const [savedContent, setSavedContent] = useState<string>(entry?.content ?? '')
  const [analysis, setAnalysis] = useState(entry?.analysis)
  const [isSaving, setIsSaving] = useState(false)
  const [autosave, setAutosave] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const isDirty = value !== savedContent

  // Keep a live ref so listeners/timers always see the current state.
  const stateRef = useRef({ value, savedContent, isSaving, autosave })
  stateRef.current = { value, savedContent, isSaving, autosave }

  // 1) Re-sync local state if we get a different entry (defensive against
  //    component reuse across navigations). Keyed on id so it never clobbers
  //    in-progress edits when only the analysis changes.
  useEffect(() => {
    setValue(entry?.content ?? '')
    setSavedContent(entry?.content ?? '')
    setAnalysis(entry?.analysis)
    setLastSaved(null)
  }, [entry?.id])

  // 2) Restore the autosave preference.
  useEffect(() => {
    setAutosave(localStorage.getItem(AUTOSAVE_KEY) === 'true')
  }, [])

  const persist = useCallback(
    async (content: string) => {
      setIsSaving(true)
      try {
        const data = await updateEntry(entry?.id, content)
        if (data?.analysis) setAnalysis(data.analysis)
        setSavedContent(content)
        setLastSaved(new Date())
        // Revalidate the list so cards reflect the new mood/summary on return.
        await update(['/journal', `/journal/${entry?.id}`])
      } finally {
        setIsSaving(false)
      }
    },
    [entry?.id]
  )

  const handleSave = useCallback(() => {
    const { value: v, savedContent: s, isSaving: saving } = stateRef.current
    if (saving || v === s) return
    persist(v)
  }, [persist])

  // Autosave (only when the toggle is on).
  useAutosave({
    data: value,
    onSave: (v: string) => {
      const { savedContent: s, isSaving: saving, autosave: on } =
        stateRef.current
      if (on && !saving && v !== s) persist(v)
    },
  })

  // Ctrl/Cmd+S to save.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSave])

  // Warn before a full page unload if there are unsaved changes.
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (stateRef.current.value !== stateRef.current.savedContent) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [])

  const toggleAutosave = () => {
    setAutosave((prev) => {
      const next = !prev
      localStorage.setItem(AUTOSAVE_KEY, String(next))
      // If turning it on with pending edits, save them right away.
      if (next && isDirty && !isSaving) persist(value)
      return next
    })
  }

  const { mood, summary, color, subject, negative } = analysis || {}
  const accent = color || '#C5D6C7'

  const analysisData = [
    { name: 'Mood', value: mood },
    { name: 'Subject', value: subject },
    { name: 'Tone', value: negative ? 'Heavier' : 'Lighter' },
  ]

  const status = isSaving
    ? { text: 'Saving & reflecting…', cls: 'text-ink-soft' }
    : isDirty
    ? { text: 'Unsaved changes', cls: 'text-clay-600' }
    : lastSaved
    ? {
        text: `Saved · ${lastSaved.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        cls: 'text-sage-600',
      }
    : { text: 'Saved', cls: 'text-sage-600' }

  return (
    <div className="grid h-full w-full grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Writing area */}
      <div className="flex flex-col lg:col-span-2">
        {/* Toolbar */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            {isSaving && <Spinner />}
            <span className={status.cls}>{status.text}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Autosave toggle */}
            <button
              type="button"
              onClick={toggleAutosave}
              className="flex items-center gap-2 text-sm text-ink-muted transition hover:text-ink"
              title="Toggle autosave"
            >
              <span
                className={`relative h-5 w-9 rounded-full transition ${
                  autosave ? 'bg-sage-500' : 'bg-ink-soft/40'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                    autosave ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </span>
              Autosave
            </button>

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="rounded-xl bg-sage-500 px-5 py-2 text-sm font-medium text-cream-50 shadow-calm transition hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>

        <textarea
          className="scrollbar-calm h-full min-h-[55vh] w-full resize-none rounded-2xl border border-line bg-cream-50 p-5 text-[17px] leading-relaxed text-ink shadow-calm outline-none transition focus:border-sage-200 focus:ring-2 focus:ring-sage-100 sm:p-7 lg:min-h-[60vh]"
          value={value}
          placeholder="Write about your day…"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      {/* Analysis panel */}
      <aside className="flex flex-col gap-4">
        <div
          className="rounded-2xl p-6 text-center shadow-calm"
          style={{ backgroundColor: accent }}
        >
          <p className="text-sm font-medium uppercase tracking-wide text-ink/60">
            Today you feel
          </p>
          <p className="mt-1 font-serif text-3xl font-semibold capitalize text-ink">
            {mood || '…'}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-cream-50 p-5 shadow-calm">
          <h3 className="mb-3 font-serif text-lg font-semibold text-ink">
            Reflection
          </h3>
          <p className="mb-4 text-[15px] leading-relaxed text-ink/80">
            {summary || 'Your reflection will appear here after you save.'}
          </p>
          <ul className="divide-y divide-line">
            {analysisData.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <span className="text-sm font-medium text-ink-muted">
                  {item.name}
                </span>
                <span className="text-right text-[15px] capitalize text-ink">
                  {item.value || '—'}
                </span>
              </li>
            ))}
          </ul>
          {isDirty && (
            <p className="mt-3 text-xs text-clay-600">
              Save to refresh this reflection.
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}

export default Editor
