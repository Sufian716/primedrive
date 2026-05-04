'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search, Shield, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'

interface SavedBooking {
  id: string
  passengerName: string
  pickup: string
  dropoff: string
  scheduledAt: string
  status: string
  price: number
}

export default function AccountPage() {
  const router = useRouter()
  const [bookingId, setBookingId] = useState('')
  const [recentBookings, setRecentBookings] = useState<SavedBooking[]>([])

  useEffect(() => {
    try {
      const saved: SavedBooking[] = JSON.parse(localStorage.getItem('pd_bookings') ?? '[]')
      setRecentBookings(saved.slice(0, 5))
      // Refresh statuses from API
      saved.slice(0, 5).forEach(b => {
        fetch(`/api/bookings/${b.id}`)
          .then(r => r.json())
          .then(data => {
            if (data.id && data.status !== b.status) {
              setRecentBookings(prev => prev.map(x => x.id === data.id ? { ...x, status: data.status } : x))
              const all: SavedBooking[] = JSON.parse(localStorage.getItem('pd_bookings') ?? '[]')
              localStorage.setItem('pd_bookings', JSON.stringify(all.map(x => x.id === data.id ? { ...x, status: data.status } : x)))
            }
          })
          .catch(() => {})
      })
    } catch {}
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-1"><ArrowLeft className="w-5 h-5 text-zinc-300" /></Link>
        <span className="font-semibold text-white">Konto</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Recent bookings */}
        {recentBookings.length > 0 && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <h2 className="font-semibold text-white text-sm">Meine Buchungen</h2>
            </div>
            {recentBookings.map(b => (
              <Link key={b.id} href={`/track/${b.id}`}
                className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white text-sm font-medium truncate">{b.dropoff}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${STATUS_COLORS[b.status as keyof typeof STATUS_COLORS] ?? 'bg-zinc-700 text-zinc-300'}`}>
                      {STATUS_LABELS[b.status as keyof typeof STATUS_LABELS] ?? b.status}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(b.scheduledAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} · {b.price.toFixed(2)} €
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {/* Find booking */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <h2 className="font-semibold text-white mb-3">Buchung nachschlagen</h2>
          <input
            value={bookingId}
            onChange={e => setBookingId(e.target.value.toUpperCase())}
            placeholder="Buchungs-ID (PD-...)"
            className="w-full h-11 px-3 rounded-xl border border-zinc-700 text-sm font-mono focus:outline-none focus:border-white bg-zinc-800 text-white placeholder:text-zinc-500 mb-2"
          />
          <Button onClick={() => bookingId && router.push(`/track/${bookingId}`)} disabled={!bookingId}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold rounded-xl h-11">
            <Search className="w-4 h-4 mr-2" />Buchung anzeigen
          </Button>
        </div>

        {/* Admin link */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <Link href="/admin" className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors">
            <div className="bg-zinc-800 p-2.5 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">Admin-Dashboard</div>
              <div className="text-xs text-zinc-500">Fahrten verwalten</div>
            </div>
            <span className="ml-auto text-zinc-600 text-lg">›</span>
          </Link>
        </div>

        {/* Info */}
        <div className="text-center pt-4">
          <div className="text-3xl mb-2">🚗</div>
          <div className="font-bold text-white">PrimeDrive</div>
          <div className="text-xs text-zinc-500">Dein Fahrservice Frankfurt</div>
          <div className="text-xs text-zinc-700 mt-1">v1.0.0</div>
        </div>
      </div>
    </div>
  )
}
