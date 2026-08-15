'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import AuthButton from '@/components/AuthButton'

export default function HomePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        if (error.message.includes('Refresh Token Not Found')) {
          supabase.auth.signOut().catch(() => {})
        }
        console.error('Session check error:', error)
        setChecking(false)
        return
      }
      if (session) {
        router.replace('/chat')
      } else {
        setChecking(false)
      }
    }).catch((err) => {
      console.error('Unhandled session error:', err)
      setChecking(false)
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1030]">
        <div className="w-8 h-8 border-4 border-[#FF4D2E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[#0B1030] text-[#F4F6FF]"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Subtle background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,77,46,0.14), transparent)'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div
          className="text-[#FF4D2E] font-semibold tracking-widest text-lg cursor-pointer select-none"
          style={{ fontFamily: 'var(--font-sans)' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ALMAZ<span className="text-[#F4F6FF] font-light">.</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/about"
            className="text-xs text-[#B6BEE0] hover:text-[#FF4D2E] uppercase tracking-widest transition-colors"
          >
            Haqqımızda
          </a>
        </div>
      </nav>

      {/* Main content — centered */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1
            className="text-6xl sm:text-7xl font-semibold text-[#F4F6FF] tracking-tight mb-3 leading-none"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            ALMAZ
          </h1>
          <p
            className="text-xs text-[#17D4E6] uppercase tracking-[0.2em] mb-5"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            الماز · алмаз · almaz
          </p>
          <p className="text-[#B6BEE0] text-base max-w-sm mx-auto leading-relaxed">
            Azərbaycan dilində anlama və cavab vermək üçün yaradılmış süni intellekt.
          </p>
        </div>

        {/* Auth form */}
        <div className="w-full max-w-sm">
          <AuthButton />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-between px-8 py-4 border-t border-white/5">
        <span className="text-xs text-[#B6BEE0]">© 2025 ALMAZ</span>
        <a
          href="/about"
          className="text-xs text-[#B6BEE0] hover:text-[#FF4D2E] transition-colors"
        >
          Haqqımızda
        </a>
      </footer>
    </div>
  )
}
