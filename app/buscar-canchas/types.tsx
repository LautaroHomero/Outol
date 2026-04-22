
export type SearchChip = {
  label: string
  active: boolean
}

export type SearchFilter = {
  label: string
  count: number
  checked: boolean
}

export type SearchCourt = {
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
  palette: {
    wrap: string
    field: string
    lineBorder: string
    lineBg: string
  }
  favorite?: boolean
}

export type SearchBooking = {
  name: string
  meta: string
  badge: string
  badgeClass: string
  strip: string
}

export type SearchPromotion = {
  title: string
  subtitle: string
  ctaLabel: string
} | null
