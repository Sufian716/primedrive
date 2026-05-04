export type BookingStatus = 'pending' | 'confirmed' | 'driver_assigned' | 'en_route' | 'arrived' | 'completed' | 'cancelled'
export type RideClass = 'economy' | 'comfort' | 'xl' | 'van'
export type PaymentMethod = 'card' | 'cash' | 'paypal'

export interface Location {
  address: string
  lat: number
  lng: number
}

export interface Booking {
  id: string
  status: BookingStatus
  rideClass: RideClass
  pickup: Location
  dropoff: Location
  passengerName: string
  passengerEmail: string
  passengerPhone: string
  passengers: number
  luggage: number
  flightNumber?: string
  flightTime?: string
  scheduledAt: string
  price: number
  currency: string
  paymentMethod: PaymentMethod
  driverName?: string
  driverPhone?: string
  driverPlate?: string
  driverEta?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface RideOption {
  class: RideClass
  name: string
  description: string
  icon: string
  basePrice: number
  pricePerKm: number
  maxPassengers: number
  eta: number
}

export const RIDE_OPTIONS: RideOption[] = [
  { class: 'economy', name: 'Economy', description: 'Günstig & zuverlässig', icon: '🚗', basePrice: 25, pricePerKm: 1.8, maxPassengers: 4, eta: 5 },
  { class: 'comfort', name: 'Comfort', description: 'Mehr Komfort & Platz', icon: '🚙', basePrice: 35, pricePerKm: 2.2, maxPassengers: 4, eta: 7 },
  { class: 'xl', name: 'XL', description: 'Für Gruppen bis 6 Personen', icon: '🚐', basePrice: 45, pricePerKm: 2.8, maxPassengers: 6, eta: 10 },
  { class: 'van', name: 'Van', description: 'Viel Gepäck? Kein Problem', icon: '🚌', basePrice: 55, pricePerKm: 3.2, maxPassengers: 8, eta: 15 },
]

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  driver_assigned: 'Fahrer zugewiesen',
  en_route: 'Unterwegs',
  arrived: 'Angekommen',
  completed: 'Abgeschlossen',
  cancelled: 'Storniert',
}

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  driver_assigned: 'bg-purple-100 text-purple-800',
  en_route: 'bg-indigo-100 text-indigo-800',
  arrived: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}
