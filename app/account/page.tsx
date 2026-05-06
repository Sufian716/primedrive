'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search, Shield, ChevronRight, Clock, LogOut } from 'lucide-react'
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
  const { user } = useUser()
  const { signOut } = useClerk()
  const [bookingId, setBookingId] = useState('')
  const [recentBookings, setRecentBookings] = useState<SavedBooking[]>([])

  useEffect(() => {
    try {
      const saved: SavedBooking[] = JSON.parse(localStorage.getItem('pd_bookings') ?? '[]')
      setRecentBookings(saved.slice(0, 5))
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
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-1"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></Link>
        <span className="font-semibold text-foreground">Konto</span>
        <button onClick={() => signOut({ redirectUrl: '/' })}
          className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-3.5 h-3.5" />Abmelden
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* User profile */}
        {user && (
          <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-4">
            {user.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
              : <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground text-lg font-bold border border-border">{user.firstName?.[0] ?? '?'}</div>
            }
            <div className="flex-1 min-w-0">
              <div className="font-bold text-foreground truncate">{user.fullName ?? user.username ?? 'Nutzer'}</div>
              <div className="text-xs text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</div>
            </div>
          </div>
        )}

        {/* Recent bookings */}
        {recentBookings.length > 0 && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground text-sm">Meine Buchungen</h2>
            </div>
            {recentBookings.map(b => (
              <Link key={b.id} href={`/track/${b.id}`}
                className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-foreground text-sm font-medium truncate mb-0.5">{b.dropoff}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${STATUS_COLORS[b.status as keyof typeof STATUS_COLORS] ?? 'bg-muted text-muted-foreground'}`}>
                      {STATUS_LABELS[b.status as keyof typeof STATUS_LABELS] ?? b.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(b.scheduledAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} · {b.price.toFixed(2)} €
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {/* Find booking */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h2 className="font-semibold text-foreground mb-3">Buchung nachschlagen</h2>
          <input value={bookingId} onChange={e => setBookingId(e.target.value.toUpperCase())}
            placeholder="Buchungs-ID (PD-...)"
            className="w-full h-11 px-3 rounded-xl border border-border text-sm font-mono focus:outline-none focus:border-foreground bg-input text-foreground placeholder:text-muted-foreground mb-2" />
          <Button onClick={() => bookingId && router.push(`/track/${bookingId}`)} disabled={!bookingId}
            className="w-full bg-primary text-primary-foreground font-bold rounded-xl h-11">
            <Search className="w-4 h-4 mr-2" />Buchung anzeigen
          </Button>
        </div>

        {/* Admin link */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <Link href="/admin" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
            <div className="bg-muted p-2.5 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-foreground">Admin-Dashboard</div>
              <div className="text-xs text-muted-foreground">Fahrten verwalten</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
          </Link>
        </div>

        {/* Info */}
        <div className="text-center pt-2 pb-4">
          <div className="text-3xl mb-2">🚗</div>
          <div className="font-bold text-foreground">PrimeDrive</div>
          <div className="text-xs text-muted-foreground">Dein Fahrservice Frankfurt</div>
        </div>
      </div>
    </div>
  )
}
