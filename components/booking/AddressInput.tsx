'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin } from 'lucide-react'
import type { Location } from '@/types'

interface Props {
  label: string
  value: Location | null
  onChange: (loc: Location) => void
  placeholder?: string
  iconColor?: string
}

export function AddressInput({ label, value, onChange, placeholder, iconColor = 'text-gray-400' }: Props) {
  const [query, setQuery] = useState(value?.address ?? '')
  const [results, setResults] = useState<Location[]>([])
  const [open, setOpen] = useState(false)
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
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => search(e.target.value), 350)
  }

  const select = (loc: Location) => {
    setQuery(loc.address)
    onChange(loc)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
      <div className="relative">
        <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor}`} />
        <input
          value={query}
          onChange={handleInput}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder ?? 'Adresse eingeben...'}
          className="w-full pl-9 pr-3 h-12 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {results.map((loc, i) => (
            <button
              key={i}
              onClick={() => select(loc)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 text-left transition-colors border-b border-gray-50 last:border-0"
            >
              <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-800 leading-tight">{loc.address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
