'use client'
import { askQuestion } from '@/utils/api'
import { useState } from 'react'
import Spinner from './Spinner'

const SUGGESTIONS = [
  'When was I happiest recently?',
  'What keeps stressing me out?',
  'Summarize my mood this week.',
]

const Question = () => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const ask = async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setAnswer(null)
    try {
      const data = await askQuestion(trimmed)
      setAnswer(data ?? 'Sorry, I could not come up with an answer.')
    } catch (e) {
      setAnswer('Something went wrong while reading your journal. Try again.')
    } finally {
      setLoading(false)
      setQuestion('')
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    ask(question)
  }

  return (
    <div className="rounded-2xl border border-line bg-cream-50 p-6 shadow-calm">
      <h3 className="mb-1 flex items-center gap-2 font-serif text-xl font-semibold text-ink">
        <span>🔮</span> Ask your journal
      </h3>
      <p className="mb-4 text-sm text-ink-muted">
        Your entries, gently searched and answered.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 rounded-xl border border-line bg-cream px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-soft focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
          disabled={loading}
          placeholder="Ask anything about your entries…"
        />
        <button
          disabled={loading || !question.trim()}
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-sage-500 px-6 py-3 font-medium text-cream-50 transition hover:bg-sage-600 disabled:opacity-50"
        >
          {loading ? <Spinner /> : null}
          {loading ? 'Thinking' : 'Ask'}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            disabled={loading}
            className="rounded-full border border-line bg-cream px-3.5 py-1.5 text-xs font-medium text-ink-muted transition hover:border-sage-200 hover:bg-sage-50 hover:text-ink disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {answer && (
        <div className="mt-5 animate-fade-in-up rounded-xl border-l-4 border-sage-400 bg-sage-50 p-4 text-[15px] leading-relaxed text-ink/90">
          {answer}
        </div>
      )}
    </div>
  )
}

export default Question
