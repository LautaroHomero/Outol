
import React from 'react'
import { SearchFilter, SearchBooking } from '../types'

export function Sidebar({
  maxPrice,
  price,
  setPrice,
  modalities,
  setModalities,
  features,
  setFeatures,
  upcomingBookings,
}: {
  maxPrice: number
  price: number
  setPrice: (p: number) => void
  modalities: SearchFilter[]
  setModalities: React.Dispatch<React.SetStateAction<SearchFilter[]>>
  features: SearchFilter[]
  setFeatures: React.Dispatch<React.SetStateAction<SearchFilter[]>>
  upcomingBookings: SearchBooking[]
}) {
  return (
    <aside className="hidden flex-col gap-3 lg:flex">
      <div className="rounded-xl border border-black/10 bg-white px-4 py-3.5">
        <h2 className="mb-3 text-xs font-semibold">Precio por hora</h2>
        <div className="mb-2 flex justify-between text-[11px] text-[#6b6b67]">
          <span>$0</span>
          <span className="font-semibold text-emerald-700">
            hasta ${price.toLocaleString('es-AR')}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={maxPrice}
          step="500"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
          className="h-1 w-full cursor-pointer accent-emerald-600"
        />
      </div>

      <FilterGroup title="Modalidad" items={modalities} setItems={setModalities} />
      <FilterGroup title="Características" items={features} setItems={setFeatures} />

      <div className="rounded-xl border border-black/10 bg-white px-4 py-3.5">
        <h2 className="mb-3 text-xs font-semibold">Mis próximas reservas</h2>
        <div className="flex flex-col gap-2.5">
          {upcomingBookings.map((booking, index) => (
            <div key={booking.name}>
              <div className="flex items-start gap-2.5">
                <div
                  className={`mt-[3px] h-[46px] w-[3px] shrink-0 rounded-sm ${booking.strip}`}
                />
                <div>
                  <p className="text-xs font-medium">{booking.name}</p>
                  <p className="mt-0.5 text-[10px] text-[#6b6b67]">
                    {booking.meta}
                  </p>
                  <span
                    className={`mt-[5px] inline-block rounded-full px-[7px] py-0.5 text-[9px] font-semibold ${booking.badgeClass}`}
                  >
                    {booking.badge}
                  </span>
                </div>
              </div>
              {index < upcomingBookings.length - 1 && (
                <div className="my-1 h-px bg-black/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function FilterGroup({
  title,
  items,
  setItems,
}: {
  title: string
  items: SearchFilter[]
  setItems: React.Dispatch<React.SetStateAction<SearchFilter[]>>
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-4 py-3.5">
      <h2 className="mb-3 text-xs font-semibold">{title}</h2>
      <div className="flex flex-col gap-[7px]">
        {items.map((item, index) => (
          <button
            key={item.label}
            onClick={() =>
              setItems((current) =>
                current.map((entry, entryIndex) =>
                  entryIndex === index
                    ? { ...entry, checked: !entry.checked }
                    : entry
                )
              )
            }
            className="flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-[9px]">
              <span
                className={`flex h-[15px] w-[15px] items-center justify-center rounded-[4px] border transition ${
                  item.checked
                    ? 'border-emerald-600 bg-emerald-600'
                    : 'border-black/20'
                }`}
              >
                {item.checked && (
                  <span className="block h-1 w-[7px] -translate-y-px rotate-[-45deg] border-b-2 border-l-2 border-white" />
                )}
              </span>
              <span className="text-xs text-[#6b6b67]">{item.label}</span>
            </div>
            <span className="rounded-full bg-[#f5f5f3] px-1.5 py-0.5 text-[10px] text-[#9e9e9a]">
              {item.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
