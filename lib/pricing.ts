import type { RideClass } from '@/types'
import { RIDE_OPTIONS } from '@/types'

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function calculatePrice(rideClass: RideClass, distanceKm: number): number {
  const option = RIDE_OPTIONS.find((o) => o.class === rideClass)!
  const raw = option.basePrice + distanceKm * option.pricePerKm
  return Math.round(raw * 100) / 100
}

// Frankfurt Airport Koordinaten
export const FRANKFURT_AIRPORT: { lat: number; lng: number; address: string } = {
  lat: 50.0379,
  lng: 8.5622,
  address: 'Flughafen Frankfurt am Main (FRA)',
}
