'use client'

import { useEffect, useState } from 'react'

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

type UseCourtSearchParams = {
  q?: string
  date?: string
  time?: string
  modalities?: string[]
  features?: string[]
  maxPrice?: number
}

type UseCourtSearchReturn = {
  courts: SearchCourt[]
  loading: boolean
  error: string | null
}

export function useCourtSearch(params: UseCourtSearchParams): UseCourtSearchReturn {
  const [courts, setCourts] = useState<SearchCourt[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Crear una clave estable para detectar cambios en los parámetros
  const paramsKey = JSON.stringify({
    q: params.q || '',
    date: params.date || '',
    time: params.time || '',
    maxPrice: params.maxPrice || 15000,
    modalities: (params.modalities || []).sort(),
    features: (params.features || []).sort(),
  })

  useEffect(() => {
    let isMounted = true

    const fetchCourts = async () => {
      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        
        if (params.q) searchParams.append('q', params.q)
        if (params.date) searchParams.append('date', params.date)
        if (params.time) searchParams.append('time', params.time)
        if (params.maxPrice) searchParams.append('maxPrice', String(params.maxPrice))
        
        params.modalities?.forEach((mod) => searchParams.append('modality', mod))
        params.features?.forEach((feat) => searchParams.append('feature', feat))

        console.log('Fetching courts with params:', Object.fromEntries(searchParams))

        const response = await fetch(`/api/courts/search?${searchParams.toString()}`)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        
        if (isMounted) {
          setCourts(data.courts || [])
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Error al buscar canchas'
          setError(message)
          setCourts([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCourts()

    return () => {
      isMounted = false
    }
  }, [paramsKey, params.q, params.date, params.time, params.maxPrice, params.modalities, params.features])

  return { courts, loading, error }
}
