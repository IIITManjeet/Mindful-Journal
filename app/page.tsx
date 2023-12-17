import Link from 'next/link'
import { auth } from '@clerk/nextjs'
export default async function Home() {
  const { userId } = await auth()
  let href = userId ? '/journal' : '/new-user'
  return (
    <div className="relative w-screen h-screen flex flex-col justify-center bg-black items-center text-white">
      <div className="flex flex-col w-full mx-auto max-w-[600px] gap-[20px]">
        <h1 className="text-3xl font-bold">
          Mindful Journal: Your AI-Powered Mood Tracker
        </h1>
        <p className="text-white/60">
          Discover the power of self-reflection with Mindful Journal, the
          ultimate companion for your emotional well-being. Seamlessly blending
          advanced AI technology with the simplicity of a daily journal, this
          app empowers you to effortlessly track and understand your mood
          patterns.
        </p>
        <Link href={href}>
          <div className="cursor">
            <button className="bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-2 rounded-lg text-md">
              Get Started
            </button>
          </div>
        </Link>
      </div>
    </div>
  )
}
