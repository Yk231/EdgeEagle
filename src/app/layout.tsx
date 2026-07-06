import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arbeagle',
  description: 'Sports betting EV finder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}