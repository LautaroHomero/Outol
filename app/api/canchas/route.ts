import { NextResponse } from 'next/server'


export async function GET() {
  const canchas = [
    { id: 1, nombre: 'Cancha Central', precio: 5000 },
    { id: 2, nombre: 'Cancha Norte', precio: 4000 },
  ]

  return NextResponse.json(canchas)
}


export async function POST(request: Request) {
  const body = await request.json()
  console.log("cancha a crear:", body)

  
  return NextResponse.json({ mensaje: 'Cancha creada', data: body }, { status: 201 })
}
