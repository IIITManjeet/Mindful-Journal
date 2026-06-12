import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ReactNode } from 'react'

const links = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/journal', label: 'Journal', icon: '📖' },
]

interface Props {
  children?: ReactNode
}

const DashBoardLayout = ({ children }: Props) => {
  return (
    <div className="relative h-screen w-screen bg-cream">
      <aside className="absolute left-0 top-0 flex h-full w-[230px] flex-col border-r border-line bg-cream-50/80 p-5 backdrop-blur">
        <div className="mb-8 flex items-center gap-2.5 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-500 text-lg shadow-calm">
            🌿
          </span>
          <span className="font-serif text-xl font-semibold text-ink">
            Mindful
          </span>
        </div>

        <nav>
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-ink-muted transition hover:bg-sage-50 hover:text-ink"
                >
                  <span className="text-base">{link.icon}</span>
                  <span className="text-[15px] font-medium">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-auto px-2 text-xs leading-relaxed text-ink-soft">
          Write freely.
          <br />
          Reflect gently.
        </p>
      </aside>

      <div className="ml-[230px] h-full overflow-x-hidden scrollbar-hide">
        <header className="sticky top-0 z-20 flex h-[64px] items-center justify-end border-b border-line bg-cream/70 px-8 backdrop-blur">
          <UserButton afterSignOutUrl="/" />
        </header>
        <div className="scrollbar-calm h-[calc(100vh-64px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashBoardLayout
