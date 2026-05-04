'use client'

import { useEffect, useState } from 'react'
import { Car, Clock, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import type { Booking } from '@/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch('/api/admin/bookings')
      .then(r => r.json())
      .then(d => setBookings(d))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    active: bookings.filter(b => ['confirmed', 'driver_assigned', 'en_route', 'arrived'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.price, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-5 text-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-5 h-5" />
              <span className="font-extrabold text-lg">PrimeDrive Admin</span>
            </div>
            <div className="text-blue-200 text-xs">Fahrtenverwaltung</div>
          </div>
          <button onClick={load} className="bg-blue-500 hover:bg-blue-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            Aktualisieren
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Ausstehend', value: stats.pending, icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-50', text: 'text-yellow-700' },
            { label: 'Aktiv', value: stats.active, icon: <Car className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', text: 'text-blue-700' },
            { label: 'Abgeschlossen', value: stats.completed, icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-50', text: 'text-green-700' },
            { label: 'Umsatz', value: `${stats.revenue.toFixed(0)} €`, icon: <TrendingUp className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', text: 'text-purple-700' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white shadow-sm`}>
              <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-xs text-gray-500 font-medium">{s.label}</span></div>
              <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Bookings table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Alle Buchungen ({bookings.length})</h2>
          </div>

          {loading && <div className="py-12 text-center text-gray-400">Lädt...</div>}

          <div className="divide-y divide-gray-50">
            {bookings.map(b => (
              <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="mt-0.5">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-base">
                    {b.rideClass === 'van' ? '🚌' : b.rideClass === 'xl' ? '🚐' : b.rideClass === 'comfort' ? '🚙' : '🚗'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{b.passengerName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[b.status]}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{b.pickup.address} → {b.dropoff.address}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(b.scheduledAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })} · {b.price.toFixed(2)} €
                  </div>
                </div>
                <span className="text-gray-300 text-lg mt-1">›</span>
              </Link>
            ))}
          </div>

          {!loading && bookings.length === 0 && (
            <div className="py-12 text-center text-gray-400">Keine Buchungen vorhanden</div>
          )}
        </div>
      </div>
    </div>
  )
}
