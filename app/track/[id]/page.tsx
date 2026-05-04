'use client'

import { useEffect, useState, use } from 'react'
import { MapView } from '@/components/map/MapView'
import { ArrowLeft, Phone, Car, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Booking } from '@/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'

export default function TrackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setBooking(d) })
      .catch(() => setError('Buchung nicht gefunden'))
      .finally(() => setLoading(false))
  }, [id])

  // Poll every 10 seconds for live updates
  useEffect(() => {
    if (!booking || ['completed', 'cancelled'].includes(booking.status)) return
    const t = setInterval(() => {
      fetch(`/api/bookings/${id}`).then(r => r.json()).then(d => { if (!d.error) setBooking(d) })
    }, 10000)
    return () => clearInterval(t)
  }, [booking, id])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <Link href="/track" className="p-1"><ArrowLeft className="w-5 h-5 text-gray-700" /></Link>
        <span className="font-semibold text-gray-900">Fahrt {id}</span>
      </div>

      {loading && <div className="flex items-center justify-center h-64 text-gray-400">Lädt...</div>}
      {error && <div className="max-w-lg mx-auto px-4 py-8 text-center text-red-500">{error}</div>}

      {booking && (
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* Map */}
          <MapView pickup={booking.pickup} dropoff={booking.dropoff} height="220px" />

          {/* Status */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[booking.status]}`}>
                {STATUS_LABELS[booking.status]}
              </span>
            </div>

            {/* Progress dots */}
            {(() => {
              const steps: Booking['status'][] = ['pending', 'confirmed', 'driver_assigned', 'en_route', 'arrived', 'completed']
              const cur = steps.indexOf(booking.status)
              return (
                <div className="flex items-center gap-1 mb-3">
                  {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${i <= cur ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < cur ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                    </div>
                  ))}
                </div>
              )
            })()}

            {booking.driverName && (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">👤</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{booking.driverName}</div>
                    <div className="text-xs text-gray-400">{booking.driverPlate}</div>
                  </div>
                </div>
                {booking.driverPhone && (
                  <a href={`tel:${booking.driverPhone}`} className="bg-blue-600 text-white p-2.5 rounded-xl">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {booking.driverEta && !['completed', 'arrived'].includes(booking.status) && (
              <div className="flex items-center gap-2 text-sm text-blue-700 mt-2">
                <Clock className="w-4 h-4" />
                Ankunft in ca. <strong>{booking.driverEta} Minuten</strong>
              </div>
            )}
          </div>

          {/* Trip details */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
            <h3 className="font-semibold text-gray-900 mb-2">Fahrtdetails</h3>
            {[
              { label: 'Abholung', value: booking.pickup.address },
              { label: 'Ziel', value: booking.dropoff.address },
              { label: 'Abholzeit', value: new Date(booking.scheduledAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) },
              { label: 'Klasse', value: booking.rideClass.toUpperCase() },
              { label: 'Personen', value: `${booking.passengers}` },
              { label: 'Preis', value: `${booking.price.toFixed(2)} €` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-900 text-right max-w-52 truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
