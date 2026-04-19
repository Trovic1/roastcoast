import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RoastCast — Your GitHub, Ruthlessly Roasted',
  description: 'AI podcast episode that roasts your GitHub profile. Two hosts, real voices, sound effects.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}