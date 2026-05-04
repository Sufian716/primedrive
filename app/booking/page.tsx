import { Suspense } from 'react'
import BookingClient from './BookingClient'

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">Lädt...</div>}>
      <BookingClient />
    </Suspense>
  )
}
