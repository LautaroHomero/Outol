
'use client'

import { useState, useMemo, useEffect } from 'react'
import { useCourtSearch } from './hooks/useCourtSearch'
import OpenCourtModal from '../components/openCourtModal'
import Link from 'next/link'

// Components
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/SideBar'
import { CourtCard } from './components/CourtCard'
import { SearchAndChips } from './components/SearchAndChips'
import { 
  SearchChip, 
  SearchFilter, 
  SearchCourt, 
  SearchBooking, 
  SearchPromotion 
} from './types'

type SearchCourtsDashboardProps = {
  chips: SearchChip[]
  modalityFilters: SearchFilter[]
  featureFilters: SearchFilter[]
  initialCourts: SearchCourt[]
  upcomingBookings: SearchBooking[]
  promotion: SearchPromotion
  resultsCount: number
  searchQuery: string
  userInitials: string
  userName: string
}

export function SearchCourtsDashboard({
  chips: initialChips,
  modalityFilters: initialModalities,
  featureFilters: initialFeatures,
  initialCourts,
  upcomingBookings,
  promotion,
  resultsCount,
  searchQuery,
  userInitials,
  userName,
}: SearchCourtsDashboardProps) {
  const [chips, setChips] = useState(initialChips)
  const [modalities, setModalities] = useState(initialModalities)
  const [features, setFeatures] = useState(initialFeatures)
  const [price, setPrice] = useState(8000)
  const [maxPrice, setMaxPrice] = useState(50000)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'valorado' | 'precio' | 'disponibilidad'>('valorado')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourt, setSelectedCourt] = useState<SearchCourt | null>(null)

  const selectedModalities = useMemo(
    () => modalities.filter((m) => m.checked).map((m) => m.label),
    [modalities]
  )
  const selectedFeatures = useMemo(
    () => features.filter((f) => f.checked).map((f) => f.label),
    [features]
  )

  useEffect(() => {
    fetch('/api/courts/max-price').then(r => r.json()).then(data => setMaxPrice(data.maxPrice)).catch(() => {})
    fetch('/api/courts/average-price').then(r => r.json()).then(data => setPrice(data.averagePrice)).catch(() => {})
  }, [])

  const { courts: fetchedCourts } = useCourtSearch({
    q: searchQuery,
    modalities: selectedModalities,
    features: selectedFeatures,
    maxPrice: maxPrice,
  })

  const courts = fetchedCourts.length > 0 ? fetchedCourts : initialCourts

  const [favorites, setFavorites] = useState(
    Object.fromEntries(courts.map((court) => [court.id, Boolean(court.favorite)]))
  )

  const sortedCourts = useMemo(() => {
    return [...courts].sort((a, b) => {
      switch (sortBy) {
        case 'valorado': return parseFloat(b.rating) - parseFloat(a.rating)
        case 'precio': return parseFloat(a.price.replace(/\D/g, '')) - parseFloat(b.price.replace(/\D/g, ''))
        case 'disponibilidad': return (b.slots?.length ?? 0) - (a.slots?.length ?? 0)
        default: return 0
      }
    })
  }, [courts, sortBy])

  const handleOpenCourtDetail = (court: SearchCourt) => {
    setSelectedCourt(court)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#eeede9] text-[#1a1a18]">
      <Navbar 
        userInitials={userInitials}
        logo={
          <Link href="/" className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-emerald-600">
            <svg viewBox="0 0 20 20" fill="none" className="h-[17px] w-[17px]">
              <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" />
              <path d="M10 2 L12 6 L10 8 L8 6Z" fill="white" opacity="0.9" />
              <path d="M10 12 L12 14 L10 18 L8 14Z" fill="white" opacity="0.9" />
              <path d="M2 10 L6 8 L8 10 L6 12Z" fill="white" opacity="0.9" />
              <path d="M12 10 L14 8 L18 10 L14 12Z" fill="white" opacity="0.9" />
            </svg>
          </Link>
        }
      />

      <SearchAndChips 
        searchQuery={searchQuery}
        userName={userName}
        chips={chips}
        setChips={setChips}
      />

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-4 py-5 lg:grid-cols-[270px_1fr] lg:px-8">
        <Sidebar 
          maxPrice={maxPrice}
          price={price}
          setPrice={setPrice}
          modalities={modalities}
          setModalities={setModalities}
          features={features}
          setFeatures={setFeatures}
          upcomingBookings={upcomingBookings}
        />

        <section className="flex min-w-0 flex-col gap-3">
          {promotion && (
            <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-[18px] py-[14px] sm:flex-row sm:items-center">
              <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-emerald-600">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-emerald-950">{promotion.title}</p>
                <p className="mt-0.5 text-[11px] text-emerald-700">{promotion.subtitle}</p>
              </div>
              <button className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">
                {promotion.ctaLabel}
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-[#6b6b67]">
              <strong className="font-semibold text-[#1a1a18]">{resultsCount} canchas</strong>{' '}
              {searchQuery ? `para "${searchQuery}"` : 'disponibles en Lomas de Zamora'}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b6b67]">
              <span>Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-md border border-black/10 bg-white px-2.5 py-[5px] text-xs outline-none"
              >
                <option value="valorado">Mejor valorado</option>
                <option value="precio">Menor precio</option>
                <option value="disponibilidad">Mayor disponibilidad</option>
              </select>
              <div className="flex overflow-hidden rounded-md border border-black/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex h-7 w-[30px] items-center justify-center ${viewMode === 'grid' ? 'bg-[#f5f5f3]' : 'bg-white'}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="0" y="0" width="5" height="5" rx="1" fill="currentColor" opacity="0.5" />
                    <rect x="7" y="0" width="5" height="5" rx="1" fill="currentColor" opacity="0.5" />
                    <rect x="0" y="7" width="5" height="5" rx="1" fill="currentColor" opacity="0.5" />
                    <rect x="7" y="7" width="5" height="5" rx="1" fill="currentColor" opacity="0.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex h-7 w-[30px] items-center justify-center ${viewMode === 'list' ? 'bg-[#f5f5f3]' : 'bg-white'}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="0" y="1" width="12" height="2" rx="1" fill="currentColor" opacity="0.5" />
                    <rect x="0" y="5" width="12" height="2" rx="1" fill="currentColor" opacity="0.5" />
                    <rect x="0" y="9" width="12" height="2" rx="1" fill="currentColor" opacity="0.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-2.5">
            {sortedCourts.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                isFavorite={favorites[court.id]}
                onToggleFavorite={(id) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }))}
                onOpenModal={handleOpenCourtDetail}
              />
            ))}
          </div>
        </section>
      </div>

      <OpenCourtModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        court={selectedCourt}
      />
    </main>
  )
}
