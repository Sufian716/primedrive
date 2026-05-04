'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapView } from '@/components/map/MapView'
import { ArrowLeft, Phone, Mail, Check, X, Car } from 'lucide-react'
import Link from 'next/link'
import type { Booking, BookingStatus } from '@/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'

const NEXT_STATUS: Partial<Record<BookingStatus, BookingStatus>> = {
  pending: 'confirmed',
  confirmed: 'driver_assigned',
  driver_assigned: 'en_route',
  en_route: 'arrived',
  arrived: 'completed',
}

export default function AdminBookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [driverName, setDriverName] = useState('')
  const [driverPhone, setDriverPhone] = useState('')
  const [driverPlate, setDriverPlate] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [showCancel, setShowCancel] = useState(false)

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => r.json())
      .then(d => {
        if (!d.error) {
          setBooking(d)
          if (d.driverName) setDriverName(d.driverName)
          if (d.driverPhone) setDriverPhone(d.driverPhone)
          if (d.driverPlate) setDriverPlate(d.driverPlate)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const update = async (data: Partial<Booking> & { cancellationReason?: string }) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const updated = await res.json()
      if (!updated.error) setBooking(updated)
    } finally {
      setUpdating(false)
    }
  }

  const handleAdvance = () => {
    if (!booking || !NEXT_STATUS[booking.status]) return
    const data: Partial<Booking> = { status: NEXT_STATUS[booking.status] }
    if (driverName) { data.driverName = driverName; data.driverPhone = driverPhone; data.driverPlate = driverPlate; data.driverEta = 10 }
    update(data)
  }

  const handleCancel = () => {
    update({ status: 'cancelled', cancellationReason: cancelReason })
    setShowCancel(false)
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Lädt...</div>
  if (!booking) return <div className="p-8 text-center text-red-500">Buchung nicht gefunden</div>

  const nextStatus = NEXT_STATUS[booking.status]
  const canCancel = !['completed', 'cancelled'].includes(booking.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <Link href="/admin" className="p-1"><ArrowLeft className="w-5 h-5 text-gray-700" /></Link>
        <div>
          <div className="font-semibold text-gray-900 text-sm">Buchung {booking.id}</div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[booking.status]}`}>
            {STATUS_LABELS[booking.status]}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <MapView pickup={booking.pickup} dropoff={booking.dropoff} height="200px" />

        {/* Action buttons */}
        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-semibold text-gray-900">Aktionen</h3>

            {/* Driver assignment (show when confirming) */}
            {booking.status === 'pending' && (
              <div className="grid grid-cols-1 gap-2">
                <input value={driverName} onChange={e => setDriverName(e.target.value)} placeholder="Fahrername"
                  className="h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={driverPhone} onChange={e => setDriverPhone(e.target.value)} placeholder="Telefon"
                    className="h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500" />
                  <input value={driverPlate} onChange={e => setDriverPlate(e.target.value)} placeholder="Kennzeichen"
                    className="h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {nextStatus && (
                <Button onClick={handleAdvance} disabled={updating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11">
                  <Check className="w-4 h-4 mr-1" />
                  {STATUS_LABELS[nextStatus]}
                </Button>
              )}
              {canCancel && (
                <Button onClick={() => setShowCancel(true)} variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-11">
                  <X className="w-4 h-4 mr-1" />
                  Stornieren
                </Button>
              )}
            </div>

            {showCancel && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                <input value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                  placeholder="Stornierungsgrund (optional)"
                  className="w-full h-10 px-3 rounded-lg border border-red-200 text-sm focus:outline-none focus:border-red-400 bg-white" />
                <div className="flex gap-2">
                  <Button onClick={handleCancel} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg h-9 text-sm">
                    Bestätigen
                  </Button>
                  <Button onClick={() => setShowCancel(false)} variant="outline" className="flex-1 rounded-lg h-9 text-sm">
                    Abbrechen
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Passenger info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Passagier</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">👤</div>
            <div>
              <div className="font-semibold text-gray-900">{booking.passengerName}</div>
              <div className="text-xs text-gray-400">{booking.passengers} Person(en) · {booking.luggage} Gepäck</div>
            </div>
          </div>
          <div className="space-y-2">
            <a href={`mailto:${booking.passengerEmail}`} className="flex items-center gap-2 text-sm text-blue-600">
              <Mail className="w-4 h-4" />{booking.passengerEmail}
            </a>
            <a href={`tel:${booking.passengerPhone}`} className="flex items-center gap-2 text-sm text-blue-600">
              <Phone className="w-4 h-4" />{booking.passengerPhone}
            </a>
          </div>
        </div>

        {/* Trip details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
          <h3 className="font-semibold text-gray-900 mb-2">Fahrtdetails</h3>
          {[
            { label: 'Abholung', value: booking.pickup.address },
            { label: 'Ziel', value: booking.dropoff.address },
            { label: 'Abholzeit', value: new Date(booking.scheduledAt).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) },
            { label: 'Klasse', value: booking.rideClass.toUpperCase() },
            { label: 'Preis', value: `${booking.price.toFixed(2)} €` },
            { label: 'Zahlung', value: booking.paymentMethod },
            ...(booking.flightNumber ? [{ label: 'Flug', value: `${booking.flightNumber}${booking.flightTime ? ' · ' + new Date(booking.flightTime).toLocaleString('de-DE', { timeStyle: 'short' }) : ''}` }] : []),
            ...(booking.notes ? [{ label: 'Hinweise', value: booking.notes }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm gap-3">
              <span className="text-gray-500 shrink-0">{label}</span>
              <span className="text-gray-900 text-right">{value}</span>
            </div>
          ))}
        </div>

        {/* Driver info */}
        {booking.driverName && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Car className="w-4 h-4" />Fahrer</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span>{booking.driverName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Kennzeichen</span><span>{booking.driverPlate}</span></div>
              <a href={`tel:${booking.driverPhone}`} className="flex items-center gap-2 text-blue-600 mt-1">
                <Phone className="w-4 h-4" />{booking.driverPhone}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
