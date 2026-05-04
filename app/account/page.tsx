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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-1"><ArrowLeft className="w-5 h-5 text-gray-700" /></Link>
        <span className="font-semibold text-gray-900">Konto</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Find booking */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Buchung nachschlagen</h2>
          <input
            value={bookingId}
            onChange={e => setBookingId(e.target.value.toUpperCase())}
            placeholder="Buchungs-ID (PD-...)"
            className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:border-blue-500 mb-2"
          />
          <Button onClick={() => bookingId && router.push(`/track/${bookingId}`)} disabled={!bookingId}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11">
            <Search className="w-4 h-4 mr-2" />Buchung anzeigen
          </Button>
        </div>

        {/* Admin link */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <Link href="/admin" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
            <div className="bg-gray-100 p-2.5 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Admin-Dashboard</div>
              <div className="text-xs text-gray-400">Fahrten verwalten</div>
            </div>
            <span className="ml-auto text-gray-300 text-lg">›</span>
          </Link>
        </div>

        {/* Info */}
        <div className="text-center pt-4">
          <div className="text-3xl mb-2">🚗</div>
          <div className="font-bold text-gray-900">PrimeDrive</div>
          <div className="text-xs text-gray-400">Dein Fahrservice Frankfurt</div>
          <div className="text-xs text-gray-300 mt-1">v1.0.0</div>
        </div>
      </div>
    </div>
  )
}
