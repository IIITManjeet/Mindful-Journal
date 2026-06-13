'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Logo from './Logo'
import {
  HomeIcon,
  JournalIcon,
  InsightsIcon,
  MenuIcon,
  CloseIcon,
} from './icons'

const links = [
  { href: '/', label: 'Home', Icon: HomeIcon },
  { href: '/journal', label: 'Journal', Icon: JournalIcon },
  { href: '/insights', label: 'Insights', Icon: InsightsIcon },
]

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href)

const NavLinks = ({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) => (
  <ul className="flex flex-col gap-1">
    {links.map(({ href, label, Icon }) => {
      const active = isActive(pathname, href)
      return (
        <li key={href}>
          <Link
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
              active
                ? 'bg-sage-100 text-ink shadow-calm'
                : 'text-ink-muted hover:bg-sage-50 hover:text-ink'
            }`}
          >
            <Icon className={active ? 'text-sage-600' : 'text-ink-soft'} />
            <span className="text-[15px] font-medium">{label}</span>
          </Link>
        </li>
      )
    })}
  </ul>
)

const DashboardNav = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-[230px] flex-col border-r border-line bg-cream-50/80 p-5 backdrop-blur md:flex">
        <Link href="/" className="mb-8 flex items-center px-1">
          <Logo size={36} withWordmark />
        </Link>
        <nav>
          <NavLinks pathname={pathname} />
        </nav>
        <p className="mt-auto px-2 text-xs leading-relaxed text-ink-soft">
          Write freely.
          <br />
          Reflect gently.
        </p>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-line bg-cream/80 px-4 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition hover:bg-sage-50 hover:text-ink"
        >
          <MenuIcon />
        </button>
        <Link href="/" className="flex items-center">
          <Logo size={30} withWordmark />
        </Link>
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[270px] flex-col border-r border-line bg-cream-50 p-5 shadow-calm-lg animate-slide-in-left">
            <div className="mb-8 flex items-center justify-between">
              <Logo size={34} withWordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition hover:bg-sage-50 hover:text-ink"
              >
                <CloseIcon />
              </button>
            </div>
            <nav>
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </nav>
            <p className="mt-auto px-2 text-xs leading-relaxed text-ink-soft">
              Write freely.
              <br />
              Reflect gently.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardNav
