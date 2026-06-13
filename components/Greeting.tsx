'use client'
import { useEffect, useState } from 'react'

const computeGreeting = (hour: number) => {
  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}

/**
 * Greeting based on the visitor's *local* time. Rendered on the client so it
 * reflects the user's timezone rather than the (UTC) server's. We re-check on
 * mount and once a minute so it stays correct if the page is left open.
 */
const Greeting = () => {
  const [hour, setHour] = useState<number | null>(null)

  useEffect(() => {
    const sync = () => setHour(new Date().getHours())
    sync()
    const id = setInterval(sync, 60_000)
    return () => clearInterval(id)
  }, [])

  // Before mount we don't know the local hour; render a neutral greeting to
  // avoid a hydration mismatch / flash of the wrong time of day.
  return <>{hour === null ? 'Hello' : computeGreeting(hour)}</>
}

export default Greeting
