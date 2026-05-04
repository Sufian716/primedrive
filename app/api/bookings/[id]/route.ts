import { NextRequest, NextResponse } from 'next/server'
import { getBooking } from '@/lib/store'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = getBooking(id)
  if (!booking) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  return NextResponse.json(booking)
}
