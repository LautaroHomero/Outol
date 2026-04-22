'use client'

import React, { useState } from 'react'
import { Navbar, HeroSection, LoginModal } from './components/landing'
import Link from 'next/link'

type Route = 'landing' | 'dashboard'

function LandingPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#eeede9] font-sans text-[#1a1a18]">
      <Navbar onOpenLogin={() => setIsLoginModalOpen(true)} />

      <HeroSection onNavigate={onNavigate} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  )
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('landing')

  const handleNavigate = (route: Route) => {
    setCurrentRoute(route)
  }

  if (currentRoute === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#eeede9] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#1a1a18]">Dashboard</h1>
            <button
              onClick={() => handleNavigate('landing')}
              className="px-4 py-2 bg-[#1D9E75] text-white rounded-md hover:bg-[#0F6E56] transition"
            >
              Volver al inicio
            </button>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-[#6b6b67] mb-4">
              Dashboard en desarrollo. Por ahora puedes navegar a:
            </p>
            <Link
              href="/buscar-canchas"
              className="inline-block px-4 py-2 bg-[#1D9E75] text-white rounded-md hover:bg-[#0F6E56] transition"
            >
              Buscar Canchas
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <LandingPage onNavigate={handleNavigate} />
}
