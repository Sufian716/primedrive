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
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-1"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></Link>
        <span className="font-semibold text-foreground">Fahrt verfolgen</span>
      </div>
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <div className="text-5xl mb-4">📍</div>
        <h1 className="text-xl font-bold text-foreground mb-2">Wo ist meine Fahrt?</h1>
        <p className="text-muted-foreground text-sm mb-6">Buchungs-ID eingeben (z.B. PD-12345678-ABCD)</p>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <input
            value={id}
            onChange={e => setId(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && id && router.push(`/track/${id}`)}
            placeholder="PD-..."
            className="w-full h-12 px-4 rounded-xl border border-border text-sm focus:outline-none focus:border-foreground bg-input text-foreground placeholder:text-muted-foreground font-mono mb-3"
          />
          <Button onClick={() => id && router.push(`/track/${id}`)} disabled={!id}
            className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-2xl">
            <Search className="w-4 h-4 mr-2" />Fahrt suchen
          </Button>
        </div>
      </div>
    </div>
  )
}
