'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Locate, Loader2 } from 'lucide-react'
import type { Location } from '@/types'

interface Props {
  label: string
  value: Location | null
  onChange: (loc: Location) => void
  placeholder?: string
  iconColor?: string
  showLocate?: boolean
}

export function AddressInput({ label, value, onChange, placeholder, iconColor = 'text-zinc-400', showLocate = false }: Props) {
  const [query, setQuery] = useState(value?.address ?? '')
  const [results, setResults] = useState<Location[]>([])
  const [open, setOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(value?.address ?? '')
  }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 3) { setResults([]); return }
    const res = await fetch(`/api/geocode?query=${encodeURIComponent(q)}`)
    const data: Location[] = await res.json()
    setResults(data)
    setOpen(true)
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setLocateError('')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => search(e.target.value), 350)
  }

  const select = (loc: Location) => {
    setQuery(loc.address)
    onChange(loc)
    setOpen(false)
  }

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocateError('GPS nicht verfügbar')
      return
    }
    setLocating(true)
    setLocateError('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        try {
          // Reverse geocode via OpenCage oder Nominatim als Fallback
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=de`
          )
          const data = await res.json()
          const address = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
          const loc: Location = { address, lat, lng }
          setQuery(address)
          onChange(loc)
        } catch {
          const loc: Location = { address: `Mein Standort (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng }
          setQuery(loc.address)
          onChange(loc)
        } finally {
          setLocating(false)
        }
      },
      (err) => {
        setLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setLocateError('Standort-Zugriff verweigert')
        } else {
          setLocateError('Standort konnte nicht ermittelt werden')
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</label>
        {showLocate && (
          <button
            type="button"
            onClick={handleLocate}
            disabled={locating}
            className="flex items-center gap-1 text-xs text-white font-medium hover:text-zinc-300 disabled:opacity-50 transition-colors"
          >
            {locating
              ? <><Loader2 className="w-3 h-3 animate-spin" />Wird ermittelt...</>
              : <><Locate className="w-3 h-3" />Meinen Standort nutzen</>
            }
          </button>
        )}
      </div>

      <div className="relative">
        <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor}`} />
        <input
          value={query}
          onChange={handleInput}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder ?? 'Adresse eingeben...'}
          className="w-full pl-9 pr-3 h-12 rounded-xl border border-zinc-700 text-sm focus:outline-none focus:border-white bg-zinc-900 text-white placeholder:text-zinc-500"
        />
      </div>

      {locateError && (
        <p className="text-xs text-red-500 mt-1">{locateError}</p>
      )}

      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-zinc-900 rounded-xl shadow-xl border border-zinc-700 overflow-hidden">
          {results.map((loc, i) => (
            <button
              key={i}
              onClick={() => select(loc)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-zinc-800 text-left transition-colors border-b border-zinc-800 last:border-0"
            >
              <MapPin className="w-4 h-4 text-white mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-200 leading-tight">{loc.address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
