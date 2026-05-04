'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const [bookingId, setBookingId] = useState('')

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-1"><ArrowLeft className="w-5 h-5 text-zinc-300" /></Link>
        <span className="font-semibold text-white">Konto</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
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
