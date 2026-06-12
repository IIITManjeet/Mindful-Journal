import Link from 'next/link'
import { auth } from '@clerk/nextjs'

export default async function Home() {
  const { userId } = await auth()
  const href = userId ? '/journal' : '/new-user'

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-cream px-6">
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-sage-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-clay/20 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-7 text-center animate-fade-in-up">
        <span className="rounded-full border border-line bg-cream-50 px-4 py-1.5 text-sm font-medium text-ink-muted shadow-calm">
          🌿 Your AI-powered mood companion
        </span>

        <h1 className="font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          A calm space to write,
          <br />
          <span className="text-sage-600">reflect</span>, and understand
          yourself.
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
          Mindful Journal blends gentle AI insight with the simplicity of a
          daily journal — helping you notice patterns, name your feelings, and
          return to yourself, one entry at a time.
        </p>

        <Link href={href}>
          <button className="group mt-2 inline-flex items-center gap-2 rounded-full bg-sage-500 px-7 py-3.5 text-base font-medium text-cream-50 shadow-calm-lg transition hover:bg-sage-600 hover:shadow-calm">
            Begin journaling
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </Link>
      </div>

      <footer className="absolute bottom-6 text-sm text-ink-soft">
        Write freely. Reflect gently.
      </footer>
    </main>
  )
}
