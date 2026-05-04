'use client'

import { useEffect, useRef } from 'react'
import type { Location } from '@/types'

interface Props {
  pickup?: Location | null
  dropoff?: Location | null
  driverLat?: number
  driverLng?: number
  height?: string
}

// OpenStreetMap via iframe — kein API Key nötig
export function MapView({ pickup, dropoff, height = '240px' }: Props) {
  const center = pickup ?? dropoff ?? { lat: 50.0379, lng: 8.5622 }
  const zoom = pickup && dropoff ? 11 : 13

  // Build OSM embed URL with markers
  const markers: string[] = []
  if (pickup) markers.push(`${pickup.lat},${pickup.lng}`)
  if (dropoff) markers.push(`${dropoff.lat},${dropoff.lng}`)

  const bbox = pickup && dropoff
    ? `${Math.min(pickup.lng, dropoff.lng) - 0.05},${Math.min(pickup.lat, dropoff.lat) - 0.05},${Math.max(pickup.lng, dropoff.lng) + 0.05},${Math.max(pickup.lat, dropoff.lat) + 0.05}`
    : undefined

  const src = bbox
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${pickup?.lat},${pickup?.lng}`
    : `https://www.openstreetmap.org/export/embed.html?mlat=${center.lat}&mlon=${center.lng}&zoom=${zoom}&layer=mapnik`

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200" style={{ height }}>
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        title="PrimeDrive Karte"
      />
    </div>
  )
}

// Statische Karten-Placeholder wenn keine Koordinaten
export function MapPlaceholder({ height = '200px' }: { height?: string }) {
  return (
    <div
      className="w-full rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center"
      style={{ height }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">🗺️</div>
        <p className="text-sm text-gray-500">Karte erscheint nach Adresseingabe</p>
      </div>
    </div>
  )
}
