import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

/* 'latin-ext' is required, not optional: the Azerbaijani letters ə (U+0259),
   ğ (U+011F), ş (U+015F) and İ (U+0130) live there, and the 'latin' subset
   stops at U+00FF. Without it they fall back to a system serif mid-word. */
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-fraunces',
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-sans',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  title: 'ALMAZ — Native Azerbaijani AI',
  description: 'The first production-grade large language model purpose-built for native Azerbaijani language understanding and generation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="az"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
