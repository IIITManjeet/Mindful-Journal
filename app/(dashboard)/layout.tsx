import { UserButton } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface Props {
  children?: ReactNode
  // any props that come into the component
}
const DashBoardLayout = ({ children }: Props) => {
  return (
    <div className="h-screen w-screen relative">
      <aside className="absolute text-center text-2xl font-bold w-[200px] top-0 left-0 h-full border-r border-black/30">
        Mindful Journal
      </aside>
      <div className="ml-[200px] h-full">
        <header className="h-[60px] border-black/30">
          <div className="h-full w-full px-6 flex items-center justify-end">
            <UserButton />
          </div>
        </header>
        <div className="h-[calc(100vh-60px)] p-2">{children}</div>
      </div>
    </div>
  )
}

export default DashBoardLayout
