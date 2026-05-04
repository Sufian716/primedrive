// In-memory store (ersetzt Datenbank für Demo — in Produktion durch Prisma/PostgreSQL ersetzen)
import type { Booking } from '@/types'

const bookings = new Map<string, Booking>()

export function createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
  const id = `PD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const now = new Date().toISOString()
  const booking: Booking = { ...data, id, createdAt: now, updatedAt: now }
  bookings.set(id, booking)
  return booking
}

export function getBooking(id: string): Booking | undefined {
  return bookings.get(id)
}

export function getAllBookings(): Booking[] {
  return Array.from(bookings.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function updateBooking(id: string, data: Partial<Booking>): Booking | null {
  const existing = bookings.get(id)
  if (!existing) return null
  const updated: Booking = { ...existing, ...data, updatedAt: new Date().toISOString() }
  bookings.set(id, updated)
  return updated
}

export function seedDemoBookings() {
  if (bookings.size > 0) return
  const demos: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      status: 'pending',
      rideClass: 'comfort',
      pickup: { address: 'Flughafen Frankfurt Terminal 1, Frankfurt', lat: 50.0379, lng: 8.5622 },
      dropoff: { address: 'Kaiserstraße 50, 60329 Frankfurt', lat: 50.1109, lng: 8.6821 },
      passengerName: 'Max Mustermann',
      passengerEmail: 'max@example.com',
      passengerPhone: '+49 170 1234567',
      passengers: 2,
      luggage: 2,
      flightNumber: 'LH 1234',
      flightTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      scheduledAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      price: 42.50,
      currency: 'EUR',
      paymentMethod: 'card',
      notes: 'Bitte bei Terminal 2 warten',
    },
    {
      status: 'confirmed',
      rideClass: 'economy',
      pickup: { address: 'Hauptbahnhof Frankfurt, Frankfurt', lat: 50.1071, lng: 8.6637 },
      dropoff: { address: 'Flughafen Frankfurt Terminal 2, Frankfurt', lat: 50.0333, lng: 8.5706 },
      passengerName: 'Anna Schmidt',
      passengerEmail: 'anna@example.com',
      passengerPhone: '+49 160 9876543',
      passengers: 1,
      luggage: 1,
      flightNumber: 'FR 5678',
      flightTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      price: 28.00,
      currency: 'EUR',
      paymentMethod: 'cash',
      driverName: 'Mehmet Yilmaz',
      driverPhone: '+49 151 5555555',
      driverPlate: 'F-PD 1234',
      driverEta: 8,
    },
  ]
  demos.forEach((d) => createBooking(d))
}
