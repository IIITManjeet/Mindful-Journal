import { UserButton } from '@clerk/nextjs'
import { ReactNode } from 'react'
import DashboardNav from '@/components/DashboardNav'

interface Props {
  children?: ReactNode
}

const DashBoardLayout = ({ children }: Props) => {
  return (
    <div className="relative min-h-screen w-full bg-cream">
      <DashboardNav />

      <div className="flex min-h-screen flex-col md:ml-[230px]">
        {/* Desktop header — the mobile bar lives in DashboardNav */}
        <header className="sticky top-0 z-20 hidden h-[64px] items-center justify-end border-b border-line bg-cream/70 px-8 backdrop-blur md:flex">
          <UserButton afterSignOutUrl="/" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default DashBoardLayout
