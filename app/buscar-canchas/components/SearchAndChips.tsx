
import React from 'react'
import { SearchChip } from '../types'

export function SearchAndChips({
  searchQuery,
  userName,
  chips,
  setChips,
}: {
  searchQuery: string
  userName: string
  chips: SearchChip[]
  setChips: React.Dispatch<React.SetStateAction<SearchChip[]>>
}) {
  return (
    <section className="border-b border-black/10 bg-white px-4 pb-4 pt-8 sm:px-8 sm:pb-5">
      <p className="mb-1 text-xs text-[#6b6b67]">Hola, {userName} 👋</p>
      <h1 className="mb-[18px] text-[22px] font-bold">¿Dónde jugamos hoy?</h1>

      <form className="flex flex-col gap-2 md:flex-row md:flex-wrap">
        <div className="relative min-w-[200px] flex-1">
          <svg
            className="pointer-events-none absolute left-[11px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#9e9e9a]"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            name="q"
            defaultValue={searchQuery}
            className="h-10 w-full rounded-md border border-black/20 bg-[#f5f5f3] pl-[34px] pr-3 text-[13px] outline-none transition focus:border-emerald-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,158,117,0.12)]"
            placeholder="Barrio, zona o nombre de la cancha…"
          />
        </div>
        <select className="h-10 rounded-md border border-black/20 bg-[#f5f5f3] px-3 text-[13px] outline-none transition focus:border-emerald-600">
          <option>Hoy, 21 abr</option>
          <option>Mañana</option>
          <option>Este finde</option>
          <option>Elegir fecha…</option>
        </select>
        <select className="h-10 rounded-md border border-black/20 bg-[#f5f5f3] px-3 text-[13px] outline-none transition focus:border-emerald-600">
          <option>Cualquier hora</option>
          <option>Mañana (8–12)</option>
          <option>Tarde (12–18)</option>
          <option>Noche (18–23)</option>
        </select>
        <button type="submit" className="h-10 rounded-md bg-emerald-600 px-[22px] text-[13px] font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]">
          Buscar
        </button>
      </form>

      <div className="mt-[14px] flex flex-wrap gap-1.5">
        {chips.map((chip, index) => (
          <button
            key={chip.label}
            onClick={() =>
              setChips((current) =>
                current.map((item, itemIndex) =>
                  itemIndex === index ? { ...item, active: !item.active } : item
                )
              )
            }
            className={`rounded-full border px-[13px] py-[5px] text-xs transition ${
              chip.active
                ? 'border-emerald-200 bg-emerald-50 font-medium text-emerald-700'
                : 'border-black/10 bg-white text-[#6b6b67] hover:border-emerald-600 hover:text-emerald-700'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  )
}
