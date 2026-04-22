import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  const result = db
    .prepare('SELECT MAX(hourly_price) as maxPrice FROM courts')
    .get() as { maxPrice: number }

  const averagePrice=result.maxPrice / 2
  return NextResponse.json({ averagePrice: averagePrice})
}