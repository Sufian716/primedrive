import { NextRequest, NextResponse } from 'next/server'
import { getBooking, updateBooking } from '@/lib/store'
import { sendCancellationEmail, sendStatusUpdateEmail } from '@/lib/email'
import type { BookingStatus } from '@/types'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = getBooking(id)
  if (!booking) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const body = await req.json()
  const updated = updateBooking(id, body)
  if (!updated) return NextResponse.json({ error: 'Update fehlgeschlagen' }, { status: 500 })

  // E-Mail bei Stornierung oder wichtigen Status-Updates
  if (body.status === 'cancelled') {
    await sendCancellationEmail(updated, body.cancellationReason)
  } else if (['confirmed', 'driver_assigned', 'en_route', 'arrived'].includes(body.status as BookingStatus)) {
    await sendStatusUpdateEmail(updated)
  }

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = getBooking(id)
  if (!booking) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const updated = updateBooking(id, { status: 'cancelled' })
  if (updated) await sendCancellationEmail(updated, 'Vom Admin storniert')
  return NextResponse.json({ ok: true })
}
