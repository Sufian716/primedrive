'use client'

import { useEffect, useState, use } from 'react'
import { MapView } from '@/components/map/MapView'
import { ArrowLeft, Phone, Clock } from 'lucide-react'
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

  useEffect(() => {
    if (!booking || ['completed', 'cancelled'].includes(booking.status)) return
    const t = setInterval(() => {
      fetch(`/api/bookings/${id}`).then(r => r.json()).then(d => { if (!d.error) setBooking(d) })
    }, 10000)
    return () => clearInterval(t)
  }, [booking, id])

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <Link href="/track" className="p-1"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></Link>
        <span className="font-semibold text-foreground">Fahrt {id}</span>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground text-sm">Lädt...</div>
        </div>
      )}

      {error && (
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-foreground font-bold text-lg mb-2">Buchung nicht gefunden</h2>
          <p className="text-muted-foreground text-sm mb-6">Die ID <span className="font-mono text-foreground">{id}</span> konnte keiner Buchung zugeordnet werden.</p>
          <Link href="/track" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-2xl text-sm hover:opacity-90 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> Neue Suche
          </Link>
        </div>
      )}

      {booking && (
        <div className="max-w-lg mx-auto px-4 py-4 pb-8 space-y-4">
          <MapView pickup={booking.pickup} dropoff={booking.dropoff} height="220px" />

          {/* Status */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground">Status</span>
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
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${i <= cur ? 'bg-foreground' : 'bg-border'}`} />
                      {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < cur ? 'bg-foreground' : 'bg-border'}`} />}
                    </div>
                  ))}
                </div>
              )
            })()}

            {booking.driverName && (
              <div className="flex items-center justify-between bg-muted rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-lg border border-border">👤</div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{booking.driverName}</div>
                    <div className="text-xs text-muted-foreground">{booking.driverPlate}</div>
                  </div>
                </div>
                {booking.driverPhone && (
                  <a href={`tel:${booking.driverPhone}`} className="bg-primary text-primary-foreground p-2.5 rounded-xl">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {booking.driverEta && !['completed', 'arrived'].includes(booking.status) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Clock className="w-4 h-4" />
                Ankunft in ca. <strong className="text-foreground">{booking.driverEta} Minuten</strong>
              </div>
            )}
          </div>

          {/* Trip details */}
          <div className="bg-card rounded-2xl p-4 border border-border space-y-2">
            <h3 className="font-semibold text-foreground mb-2">Fahrtdetails</h3>
            {[
              { label: 'Abholung', value: booking.pickup.address },
              { label: 'Ziel', value: booking.dropoff.address },
              { label: 'Abholzeit', value: new Date(booking.scheduledAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) },
              { label: 'Klasse', value: booking.rideClass.toUpperCase() },
              { label: 'Personen', value: `${booking.passengers}` },
              { label: 'Preis', value: `${booking.price.toFixed(2)} €` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground text-right max-w-52 truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
