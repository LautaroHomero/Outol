import { getDb } from '@/lib/db'

type SearchChip = {
  label: string
  active: boolean
}

type SearchFilter = {
  label: string
  count: number
  checked: boolean
}

type SearchCourt = {
  id: string
  name: string
  price: string
  priceOld?: string
  priceClass?: string
  meta: string
  tags: Array<{ label: string; tone?: 'green' | 'blue' | 'red' }>
  rating: string
  reviews: string
  slots?: string[]
  slotsMore?: string
  badge?: { label: string; tone: 'blue' | 'red' | 'gray' }
  featured?: boolean
  noSlots?: boolean
  favorite?: boolean
  palette: {
    wrap: string
    field: string
    lineBorder: string
    lineBg: string
  }
}

type SearchBooking = {
  name: string
  meta: string
  badge: string
  badgeClass: string
  strip: string
}

export type SearchPageData = {
  chips: SearchChip[]
  modalityFilters: SearchFilter[]
  featureFilters: SearchFilter[]
  courts: SearchCourt[]
  upcomingBookings: SearchBooking[]
  promotion: {
    title: string
    subtitle: string
    ctaLabel: string
  } | null
  resultsCount: number
  searchQuery: string
}

export type SearchFilters = {
  q?: string
}

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`
}

function formatCourtType(value: string) {
  if (value === 'FIVE') return 'Fútbol 5'
  if (value === 'SEVEN') return 'Fútbol 7'
  return 'Fútbol 11'
}

function formatSurface(value: string) {
  if (value === 'SYNTHETIC') return 'Césped sintético'
  if (value === 'NATURAL') return 'Césped natural'
  return 'Cemento'
}

function mapTone(tone: string): 'green' | 'blue' | 'red' | undefined {
  if (tone === 'GREEN') return 'green'
  if (tone === 'BLUE') return 'blue'
  if (tone === 'RED') return 'red'
  return undefined
}

function mapBadgeTone(tone: string): 'blue' | 'red' | 'gray' {
  if (tone === 'BLUE') return 'blue'
  if (tone === 'RED') return 'red'
  return 'gray'
}

function getBookingBadge(status: string) {
  if (status === 'CONFIRMED') {
    return {
      badge: 'Confirmada',
      badgeClass: 'bg-emerald-50 text-emerald-700',
      strip: 'bg-emerald-500',
    }
  }

  if (status === 'PENDING') {
    return {
      badge: 'Pendiente pago',
      badgeClass: 'bg-amber-50 text-amber-700',
      strip: 'bg-amber-400',
    }
  }

  return {
    badge: 'Cancelada',
    badgeClass: 'bg-red-50 text-red-700',
    strip: 'bg-red-500',
  }
}

export async function getSearchPageData(
  filters: SearchFilters = {}
): Promise<SearchPageData> {
  const db = getDb()
  const searchQuery = filters.q?.trim() ?? ''
  const normalizedQuery = searchQuery.toLowerCase()

  const courtsBase = db
    .prepare(
      `
      SELECT
        c.*,
        v.city,
        v.neighborhood,
        v.address
      FROM courts c
      INNER JOIN venues v ON v.id = c.venue_id
      ORDER BY c.featured DESC
    `
    )
    .all() as Array<Record<string, number | string | null>>

  const courts = normalizedQuery
    ? courtsBase.filter((court) => {
        const haystack = [
          String(court.name ?? ''),
          String(court.neighborhood ?? ''),
          String(court.city ?? ''),
          String(court.address ?? ''),
        ]
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedQuery)
      })
    : courtsBase

  const amenities = db
    .prepare(
      `
      SELECT ca.court_id, a.label, a.tone
      FROM court_amenities ca
      INNER JOIN amenities a ON a.id = ca.amenity_id
      ORDER BY a.label ASC
    `
    )
    .all() as Array<{ court_id: string; label: string; tone: string }>

  const slots = db
    .prepare(
      `
      SELECT court_id, label, position
      FROM court_slots
      ORDER BY court_id ASC, position ASC
    `
    )
    .all() as Array<{ court_id: string; label: string; position: number }>

  const favorites = db
    .prepare(
      `
      SELECT f.court_id
      FROM favorites f
      INNER JOIN users u ON u.id = f.user_id
      WHERE u.email = ?
    `
    )
    .all('santiago@golfield.local') as Array<{ court_id: string }>

  const reservations = db
    .prepare(
      `
      SELECT
        r.status,
        r.starts_at,
        r.ends_at,
        c.name as court_name,
        c.court_type
      FROM reservations r
      INNER JOIN users u ON u.id = r.user_id
      INNER JOIN courts c ON c.id = r.court_id
      WHERE u.email = ?
      ORDER BY r.starts_at ASC
      LIMIT 2
    `
    )
    .all('santiago@golfield.local') as Array<{
      status: string
      starts_at: string
      ends_at: string
      court_name: string
      court_type: string
    }>

  const promotion = db
    .prepare(
      `
      SELECT title, subtitle, cta_label
      FROM promotions
      WHERE is_active = 1
      LIMIT 1
    `
    )
    .get() as { title: string; subtitle: string; cta_label: string } | undefined

  const amenitiesByCourt = Object.groupBy(amenities, ({ court_id }) => court_id)
  const slotsByCourt = Object.groupBy(slots, ({ court_id }) => court_id)
  const favoriteIds = new Set(favorites.map((favorite) => favorite.court_id))

  const mappedCourts: SearchCourt[] = courts.map((court) => {
    const courtAmenities = amenitiesByCourt[String(court.id)] ?? []
    const courtSlots = (slotsByCourt[String(court.id)] ?? []).map((slot) => slot.label)

    return {
      id: String(court.id),
      name: String(court.name),
      price: formatPrice(Number(court.hourly_price)),
      priceOld: court.old_hourly_price
        ? formatPrice(Number(court.old_hourly_price))
        : undefined,
      priceClass: court.old_hourly_price ? 'text-red-700' : undefined,
      meta: [
        formatCourtType(String(court.court_type)),
        formatSurface(String(court.surface)),
        Number(court.is_covered) ? 'Cubierta' : 'Descubierta',
      ].join(' · '),
      tags: courtAmenities.map((amenity) => ({
        label: amenity.label,
        tone: mapTone(amenity.tone),
      })),
      rating: Number(court.rating_average).toFixed(1),
      reviews: String(court.reviews_count),
      slots: Number(court.no_slots_today) ? undefined : courtSlots.slice(0, 3),
      slotsMore:
        Number(court.no_slots_today) || courtSlots.length <= 3
          ? undefined
          : `+${courtSlots.length - 3}`,
      badge:
        court.badge_label && court.badge_tone
          ? {
              label: String(court.badge_label),
              tone: mapBadgeTone(String(court.badge_tone)),
            }
          : undefined,
      featured: Boolean(court.featured),
      noSlots: Boolean(court.no_slots_today),
      favorite: favoriteIds.has(String(court.id)),
      palette: {
        wrap: String(court.palette_wrap_class),
        field: String(court.palette_field_class),
        lineBorder: String(court.palette_line_border_class),
        lineBg: String(court.palette_line_bg_class),
      },
    }
  })

  const upcomingBookings: SearchBooking[] = reservations.map((reservation) => {
    const startsAt = new Date(reservation.starts_at)
    const endsAt = new Date(reservation.ends_at)
    const dateLabel = new Intl.DateTimeFormat('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(startsAt)
    const timeLabel = `${new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(startsAt)}–${new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(endsAt)}`

    return {
      name: reservation.court_name,
      meta: `${dateLabel} · ${timeLabel} · ${formatCourtType(reservation.court_type)}`,
      ...getBookingBadge(reservation.status),
    }
  })

  return {
    chips: [
      { label: 'Fútbol 5', active: true },
      { label: 'Fútbol 7', active: false },
      { label: 'Fútbol 11', active: false },
      { label: 'Césped sintético', active: true },
      { label: 'Cubierta', active: false },
      { label: 'Iluminación', active: false },
      { label: 'Estacionamiento', active: false },
      { label: 'Vestuarios', active: false },
      { label: 'Hasta $8.000/h', active: true },
    ],
    modalityFilters: [
      {
        label: 'Fútbol 5',
        count: courts.filter((court) => court.court_type === 'FIVE').length,
        checked: true,
      },
      {
        label: 'Fútbol 7',
        count: courts.filter((court) => court.court_type === 'SEVEN').length,
        checked: true,
      },
      {
        label: 'Fútbol 11',
        count: courts.filter((court) => court.court_type === 'ELEVEN').length,
        checked: false,
      },
    ],
    featureFilters: [
      {
        label: 'Césped sintético',
        count: courts.filter((court) => court.surface === 'SYNTHETIC').length,
        checked: true,
      },
      {
        label: 'Césped natural',
        count: courts.filter((court) => court.surface === 'NATURAL').length,
        checked: false,
      },
      {
        label: 'Cubierta',
        count: courts.filter((court) => Number(court.is_covered)).length,
        checked: false,
      },
      {
        label: 'Iluminación LED',
        count: courts.filter((court) => Number(court.has_lighting)).length,
        checked: true,
      },
      {
        label: 'Estacionamiento',
        count: courts.filter((court) => Number(court.has_parking)).length,
        checked: false,
      },
      {
        label: 'Vestuarios',
        count: courts.filter((court) => Number(court.has_locker_room)).length,
        checked: false,
      },
    ],
    courts: mappedCourts,
    upcomingBookings,
    promotion: promotion
      ? {
          title: promotion.title,
          subtitle: promotion.subtitle,
          ctaLabel: promotion.cta_label,
        }
      : null,
    resultsCount: mappedCourts.length,
    searchQuery,
  }
}

type SearchCourtParams = {
  q?: string
  date?: string
  time?: string
  modalities?: string[]
  features?: string[]
  maxPrice?: number
}

export async function searchCourt(params: SearchCourtParams) {
  const db = getDb()
  const { q = '', modalities = [], features = [], maxPrice = 15000 } = params
  const normalizedQuery = q.toLowerCase()

  console.log('searchCourt called with:', { q, modalities, features, maxPrice })

  const courtsBase = db
    .prepare(
      `
      SELECT
        c.*,
        v.city,
        v.neighborhood,
        v.address
      FROM courts c
      INNER JOIN venues v ON v.id = c.venue_id
    `
    )
    .all() as Array<Record<string, number | string | null>>

  // Filtrar por query
  let courts = normalizedQuery
    ? courtsBase.filter((court) => {
        const haystack = [
          String(court.name ?? ''),
          String(court.neighborhood ?? ''),
          String(court.city ?? ''),
          String(court.address ?? ''),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    : courtsBase

  // Filtrar por precio
  courts = courts.filter((court) => Number(court.hourly_price) <= maxPrice)
  console.log(`After price filter (maxPrice: ${maxPrice}): ${courts.length} courts`)

  // Filtrar por modalidades si hay seleccionadas
  if (modalities.length > 0) {
    const modalityMap: { [key: string]: string } = {
      'Fútbol 5': 'FIVE',
      'Fútbol 7': 'SEVEN',
      'Fútbol 11': 'ELEVEN',
    }
    const dbModalities = modalities.map((m) => modalityMap[m] || m)
    courts = courts.filter((court) => dbModalities.includes(String(court.court_type)))
    console.log(`After modality filter (${modalities.join(', ')}): ${courts.length} courts`)
  }

  // Filtrar por features si hay seleccionadas
  if (features.length > 0) {
    courts = courts.filter((court) => {
      return features.every((feature) => {
        if (feature === 'Cubierta') return Number(court.is_covered)
        if (feature === 'Iluminación LED') return Number(court.has_lighting)
        if (feature === 'Estacionamiento') return Number(court.has_parking)
        if (feature === 'Vestuarios') return Number(court.has_locker_room)
        if (feature === 'Césped sintético') return court.surface === 'SYNTHETIC'
        if (feature === 'Césped natural') return court.surface === 'NATURAL'
        return true
      })
    })
    console.log(`After feature filter (${features.join(', ')}): ${courts.length} courts`)
  }

  const amenities = db
    .prepare(
      `
      SELECT ca.court_id, a.label, a.tone
      FROM court_amenities ca
      INNER JOIN amenities a ON a.id = ca.amenity_id
      ORDER BY a.label ASC
    `
    )
    .all() as Array<{ court_id: string; label: string; tone: string }>

  const slots = db
    .prepare(
      `
      SELECT court_id, label, position
      FROM court_slots
      ORDER BY court_id ASC, position ASC
    `
    )
    .all() as Array<{ court_id: string; label: string; position: number }>

  const favorites = db
    .prepare(
      `
      SELECT f.court_id
      FROM favorites f
      INNER JOIN users u ON u.id = f.user_id
      WHERE u.email = ?
    `
    )
    .all('santiago@golfield.local') as Array<{ court_id: string }>

  const amenitiesByCourt = Object.groupBy(amenities, ({ court_id }) => court_id)
  const slotsByCourt = Object.groupBy(slots, ({ court_id }) => court_id)
  const favoriteIds = new Set(favorites.map((favorite) => favorite.court_id))

  const mappedCourts: SearchCourt[] = courts.map((court) => {
    const courtAmenities = amenitiesByCourt[String(court.id)] ?? []
    const courtSlots = (slotsByCourt[String(court.id)] ?? []).map((slot) => slot.label)

    return {
      id: String(court.id),
      name: String(court.name),
      price: formatPrice(Number(court.hourly_price)),
      priceOld: court.old_hourly_price
        ? formatPrice(Number(court.old_hourly_price))
        : undefined,
      priceClass: court.old_hourly_price ? 'text-red-700' : undefined,
      meta: [
        formatCourtType(String(court.court_type)),
        formatSurface(String(court.surface)),
        Number(court.is_covered) ? 'Cubierta' : 'Descubierta',
      ].join(' · '),
      tags: courtAmenities.map((amenity) => ({
        label: amenity.label,
        tone: mapTone(amenity.tone),
      })),
      rating: Number(court.rating_average).toFixed(1),
      reviews: String(court.reviews_count),
      slots: Number(court.no_slots_today) ? undefined : courtSlots.slice(0, 3),
      slotsMore:
        Number(court.no_slots_today) || courtSlots.length <= 3
          ? undefined
          : `+${courtSlots.length - 3}`,
      badge:
        court.badge_label && court.badge_tone
          ? {
              label: String(court.badge_label),
              tone: mapBadgeTone(String(court.badge_tone)),
            }
          : undefined,
      featured: Boolean(court.featured),
      noSlots: Boolean(court.no_slots_today),
      favorite: favoriteIds.has(String(court.id)),
      palette: {
        wrap: String(court.palette_wrap_class),
        field: String(court.palette_field_class),
        lineBorder: String(court.palette_line_border_class),
        lineBg: String(court.palette_line_bg_class),
      },
    }
  })

  return mappedCourts
}
