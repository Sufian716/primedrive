import { NextRequest, NextResponse } from 'next/server'
import { createBooking, getAllBookings, seedDemoBookings } from '@/lib/store'
import { sendBookingConfirmation } from '@/lib/email'
import { calculatePrice, calculateDistance } from '@/lib/pricing'
import type { RideClass, PaymentMethod } from '@/types'

export async function GET() {
  seedDemoBookings()
  return NextResponse.json(getAllBookings())
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pickup, dropoff, passengerName, passengerEmail, passengerPhone,
      passengers, luggage, rideClass, flightNumber, flightTime,
      scheduledAt, paymentMethod, notes } = body

    if (!pickup || !dropoff || !passengerName || !passengerEmail || !scheduledAt) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    const distanceKm = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng)
    const price = calculatePrice(rideClass as RideClass, distanceKm)

    const booking = createBooking({
      status: 'pending',
      rideClass: rideClass as RideClass,
      pickup,
      dropoff,
      passengerName,
      passengerEmail,
      passengerPhone: passengerPhone ?? '',
      passengers: parseInt(passengers) || 1,
      luggage: parseInt(luggage) || 0,
      flightNumber,
      flightTime,
      scheduledAt,
      price,
      currency: 'EUR',
      paymentMethod: paymentMethod as PaymentMethod,
      notes,
    })

    await sendBookingConfirmation(booking)
    return NextResponse.json(booking, { status: 201 })
  } catch (err) {
    console.error('[POST /api/bookings]', err)
    return NextResponse.json({ error: 'Buchung fehlgeschlagen' }, { status: 500 })
  }
}
