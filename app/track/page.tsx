'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'

export default function TrackPage() {
  const router = useRouter()
  const [id, setId] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-1"><ArrowLeft className="w-5 h-5 text-gray-700" /></Link>
        <span className="font-semibold text-gray-900">Fahrt verfolgen</span>
      </div>
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <div className="text-5xl mb-4">📍</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Wo ist meine Fahrt?</h1>
        <p className="text-gray-500 text-sm mb-6">Buchungs-ID eingeben (z.B. PD-12345678-ABCD)</p>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <input
            value={id}
            onChange={e => setId(e.target.value.toUpperCase())}
            placeholder="PD-..."
            className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 font-mono mb-3"
          />
          <Button
            onClick={() => id && router.push(`/track/${id}`)}
            disabled={!id}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold"
          >
            <Search className="w-4 h-4 mr-2" />
            Fahrt suchen
          </Button>
        </div>
      </div>
    </div>
  )
}
