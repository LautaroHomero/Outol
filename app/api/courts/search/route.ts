import { NextRequest, NextResponse } from 'next/server'
import { searchCourt } from '@/lib/repositories/search'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const q = searchParams.get('q') ?? ''
  const date = searchParams.get('date') ?? ''
  const time = searchParams.get('time') ?? ''
  const modalities = searchParams.getAll('modality')
  const features = searchParams.getAll('feature')
  const maxPrice = Number(searchParams.get('maxPrice') ?? 15000)

  console.log('API received params:', { q, date, time, modalities, features, maxPrice })

  try {
    const courts = await searchCourt({ q, date, time, modalities, features, maxPrice })
    return NextResponse.json({ courts })
  } catch (error) {
    console.error('[GET /api/courts/search]', error)
    return NextResponse.json({ error: 'Error al buscar canchas' }, { status: 500 })
  }
}
