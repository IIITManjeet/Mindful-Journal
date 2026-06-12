'use client'
import { createNewEntry } from '@/utils/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Spinner from './Spinner'

const STARTERS = [
  { emoji: '🌅', label: 'How I’m feeling right now', seed: 'Right now, I’m feeling ' },
  { emoji: '🙏', label: 'Something I’m grateful for', seed: 'Today I’m grateful for ' },
  { emoji: '🌧️', label: 'What’s weighing on me', seed: 'Something on my mind is ' },
  { emoji: '✨', label: 'A small win today', seed: 'A small win today was ' },
]

const STEPS = [
  { icon: '✍️', title: 'Write freely', text: 'Jot down whatever’s on your mind — no rules.' },
  { icon: '🧠', title: 'Get insight', text: 'AI gently reflects your mood, themes, and tone.' },
  { icon: '🌤️', title: 'See patterns', text: 'Watch your emotional weather unfold over time.' },
]

const Onboarding = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const start = async (seed?: string, key?: string) => {
    if (loading) return
    setLoading(key || 'blank')
    const data = await createNewEntry(seed)
    router.push(`/journal/${data?.id}`)
  }

  return (
    <div className="animate-fade-in-up rounded-2xl border border-line bg-cream-50 p-8 shadow-calm sm:p-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-3 text-5xl">🌿</div>
        <h2 className="font-serif text-3xl font-semibold text-ink">
          Welcome to your calm space
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-muted">
          This is yours alone — a quiet place to write, reflect, and slowly
          understand yourself. Here’s how it works:
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-line bg-cream p-5 text-center"
          >
            <div className="mb-2 text-2xl">{s.icon}</div>
            <h3 className="font-serif text-lg font-semibold text-ink">
              {s.title}
            </h3>
            <p className="mt-1 text-sm text-ink-muted">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <p className="mb-3 text-center text-sm font-medium text-ink-muted">
          Not sure where to begin? Pick a prompt:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STARTERS.map((s) => (
            <button
              key={s.label}
              onClick={() => start(s.seed, s.label)}
              disabled={!!loading}
              className="flex items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3.5 text-left transition hover:border-sage-300 hover:bg-sage-50 disabled:opacity-60"
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="font-medium text-ink">{s.label}</span>
              {loading === s.label && (
                <span className="ml-auto">
                  <Spinner />
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => start()}
            disabled={!!loading}
            className="inline-flex items-center gap-2 rounded-full bg-sage-500 px-7 py-3 font-medium text-cream-50 shadow-calm transition hover:bg-sage-600 disabled:opacity-60"
          >
            {loading === 'blank' ? <Spinner /> : null}
            Start with a blank page →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
