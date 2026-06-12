import './globals.css'
import { Inter, Fraunces } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata = {
  title: 'Mindful Journal — Your AI Mood Companion',
  description:
    'A calm space to write, reflect, and understand your emotions with gentle AI insight.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
