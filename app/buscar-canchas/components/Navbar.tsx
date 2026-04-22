
import React from 'react'

export function Navbar({ logo, userInitials }: { logo: React.ReactNode; userInitials: string }) {
  return (
    <nav className="sticky top-0 z-50 flex h-[54px] items-center justify-between border-b border-black/10 bg-white px-4 shadow-[0_1px_0_rgba(0,0,0,0.1)] sm:px-8">
      <div className="flex items-center gap-2.5">
        {logo}
        <span className="text-[15px] font-semibold">GolField</span>
      </div>

      <div className="hidden items-center gap-0.5 md:flex">
        {[
          { label: 'Buscar canchas', active: true },
          { label: 'Mis reservas', active: false },
          { label: 'Favoritos', active: false },
          { label: 'Torneos', active: false },
        ].map(({ label, active }) => (
          <a
            key={label}
            href="#"
            className={`rounded-md px-3 py-2 text-[13px] transition ${
              active
                ? 'font-medium text-emerald-700'
                : 'text-[#6b6b67] hover:bg-[#f5f5f3] hover:text-[#1a1a18]'
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative flex h-[34px] w-[34px] items-center justify-center rounded-md border border-black/10 transition hover:border-black/20"
          aria-label="Notificaciones"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M8 1a5 5 0 00-5 5v3L1.5 11h13L13 9V6a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" />
            <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span className="absolute right-[7px] top-[7px] h-1.5 w-1.5 rounded-full border border-white bg-red-500" />
        </button>
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-sky-100 text-[11px] font-semibold text-sky-700">
          {userInitials}
        </div>
      </div>
    </nav>
  )
}
