'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AddressInput } from '@/components/booking/AddressInput'
import { RideSelector } from '@/components/booking/RideSelector'
import { MapView, MapPlaceholder } from '@/components/map/MapView'
import { Button } from '@/components/ui/button'
import { calculateDistance, calculatePrice, FRANKFURT_AIRPORT } from '@/lib/pricing'
import { ArrowLeft, ChevronRight, Plane, Users, CreditCard, Banknote, Wallet } from 'lucide-react'
import Link from 'next/link'
import type { Location, RideClass, PaymentMethod } from '@/types'

const STEPS = ['Route', 'Details', 'Fahrzeug', 'Bezahlen', 'Bestätigung']

export default function BookingClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [pickup, setPickup] = useState<Location | null>(null)
  const [dropoff, setDropoff] = useState<Location | null>(null)
  const [rideClass, setRideClass] = useState<RideClass>('economy')
  const [scheduledAt, setScheduledAt] = useState(() => new Date().toISOString().slice(0, 16))
  const [passengerName, setPassengerName] = useState('')
  const [passengerEmail, setPassengerEmail] = useState('')
  const [passengerPhone, setPassengerPhone] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [luggage, setLuggage] = useState(1)
  const [flightNumber, setFlightNumber] = useState('')
  const [flightTime, setFlightTime] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    const type = searchParams.get('type')
    const fn = searchParams.get('flight')
    const ft = searchParams.get('flightTime')
    if (fn) setFlightNumber(fn)
    if (ft) setFlightTime(ft)
    if (type === 'airport') setDropoff({ ...FRANKFURT_AIRPORT })
  }, [searchParams])

  const distanceKm = pickup && dropoff ? calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng) : 10
  const price = calculatePrice(rideClass, distanceKm)

  const canNext = () => {
    if (step === 0) return !!(pickup && dropoff && scheduledAt)
    if (step === 1) return !!(passengerName && passengerEmail && passengerPhone)
    return true
  }

  const handleBook = async () => {
    setLoading(true)
    setBookingError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, dropoff, rideClass, scheduledAt, passengerName, passengerEmail, passengerPhone, passengers, luggage, flightNumber, flightTime, paymentMethod, notes }),
      })
      const data = await res.json()
      if (data.id) {
        setBookingId(data.id)
        setStep(4)
        try {
          const saved = JSON.parse(localStorage.getItem('pd_bookings') ?? '[]')
          saved.unshift({ id: data.id, passengerName, pickup: pickup?.address, dropoff: dropoff?.address, scheduledAt, status: data.status, price: data.price })
          localStorage.setItem('pd_bookings', JSON.stringify(saved.slice(0, 20)))
        } catch {}
      } else {
        setBookingError(data.error ?? 'Buchung fehlgeschlagen. Bitte erneut versuchen.')
      }
    } catch {
      setBookingError('Verbindungsfehler. Bitte erneut versuchen.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().slice(0, 16)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        {step > 0 && step < 4
          ? <button onClick={() => setStep(s => s - 1)} className="p-1"><ArrowLeft className="w-5 h-5 text-zinc-300" /></button>
          : <Link href="/" className="p-1"><ArrowLeft className="w-5 h-5 text-zinc-300" /></Link>}
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">{STEPS[step]}</div>
          <div className="flex gap-1 mt-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-white' : 'bg-zinc-700'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 pb-8 space-y-4">
        {/* STEP 0: Route */}
        {step === 0 && (
          <>
            {pickup && dropoff ? <MapView pickup={pickup} dropoff={dropoff} height="200px" /> : <MapPlaceholder height="160px" />}
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
              <AddressInput label="Abholung" value={pickup} onChange={setPickup} placeholder="Abholadresse eingeben..." iconColor="text-green-400" showLocate />
              <div className="border-t border-dashed border-zinc-700" />
              <AddressInput label="Ziel" value={dropoff} onChange={setDropoff} placeholder="Zieladresse eingeben..." iconColor="text-red-400" />
            </div>
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Abholzeit</label>
              <input type="datetime-local" min={today} value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
                className="w-full h-12 px-3 rounded-xl border border-zinc-700 text-sm focus:outline-none focus:border-white bg-zinc-800 text-white" />
            </div>
          </>
        )}

        {/* STEP 1: Passenger details */}
        {step === 1 && (
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
            <h2 className="font-semibold text-white">Ihre Daten</h2>
            {[
              { label: 'Vollständiger Name', value: passengerName, onChange: setPassengerName, placeholder: 'Max Mustermann', type: 'text' },
              { label: 'E-Mail', value: passengerEmail, onChange: setPassengerEmail, placeholder: 'max@beispiel.de', type: 'email' },
              { label: 'Telefon', value: passengerPhone, onChange: setPassengerPhone, placeholder: '+49 170 1234567', type: 'tel' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">{f.label}</label>
                <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                  className="w-full h-12 px-3 rounded-xl border border-zinc-700 text-sm focus:outline-none focus:border-white bg-zinc-800 text-white placeholder:text-zinc-500" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1 mb-1"><Users className="w-3 h-3" />Personen</label>
                <select value={passengers} onChange={e => setPassengers(Number(e.target.value))}
                  className="w-full h-12 px-3 rounded-xl border border-zinc-700 text-sm bg-zinc-800 text-white focus:outline-none focus:border-white">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">🧳 Gepäck</label>
                <select value={luggage} onChange={e => setLuggage(Number(e.target.value))}
                  className="w-full h-12 px-3 rounded-xl border border-zinc-700 text-sm bg-zinc-800 text-white focus:outline-none focus:border-white">
                  {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Stück</option>)}
                </select>
              </div>
            </div>
            <div className="border-t border-zinc-700 pt-3">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1 mb-2"><Plane className="w-3 h-3" />Flugdaten (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={flightNumber} onChange={e => setFlightNumber(e.target.value)} placeholder="LH 1234"
                  className="h-11 px-3 rounded-xl border border-zinc-700 text-sm focus:outline-none focus:border-white bg-zinc-800 text-white placeholder:text-zinc-500" />
                <input type="datetime-local" value={flightTime} onChange={e => setFlightTime(e.target.value)}
                  className="h-11 px-3 rounded-xl border border-zinc-700 text-sm focus:outline-none focus:border-white bg-zinc-800 text-white" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Hinweise (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="z.B. Rollstuhl, Kindersitz..."
                className="w-full px-3 py-2 rounded-xl border border-zinc-700 text-sm focus:outline-none focus:border-white bg-zinc-800 text-white placeholder:text-zinc-500 resize-none" />
            </div>
          </div>
        )}

        {/* STEP 2: Vehicle */}
        {step === 2 && (
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="font-semibold text-white mb-1">Fahrzeugklasse wählen</h2>
            <p className="text-xs text-zinc-500 mb-3">Strecke: ca. {distanceKm.toFixed(1)} km</p>
            <RideSelector selected={rideClass} onSelect={setRideClass} distanceKm={distanceKm} />
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === 3 && (
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
            <h2 className="font-semibold text-white">Zahlungsart</h2>
            {([
              { method: 'card' as PaymentMethod, icon: <CreditCard className="w-5 h-5" />, label: 'Kreditkarte', sub: 'Visa, Mastercard, Amex' },
              { method: 'paypal' as PaymentMethod, icon: <Wallet className="w-5 h-5" />, label: 'PayPal', sub: 'Sicher & schnell' },
              { method: 'cash' as PaymentMethod, icon: <Banknote className="w-5 h-5" />, label: 'Barzahlung', sub: 'Im Fahrzeug bezahlen' },
            ]).map(({ method, icon, label, sub }) => (
              <button key={method} onClick={() => setPaymentMethod(method)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${paymentMethod === method ? 'border-white bg-zinc-800' : 'border-zinc-700 hover:border-zinc-500'}`}>
                <div className={`p-2 rounded-xl ${paymentMethod === method ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>{icon}</div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-white text-sm">{label}</div>
                  <div className="text-xs text-zinc-500">{sub}</div>
                </div>
                {paymentMethod === method && <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-xs font-bold">✓</div>}
              </button>
            ))}
            <div className="border-t border-zinc-700 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-zinc-500">Abholung</span><span className="text-white text-right max-w-52 truncate">{pickup?.address}</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-500">Ziel</span><span className="text-white text-right max-w-52 truncate">{dropoff?.address}</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-500">Abholzeit</span><span className="text-white">{scheduledAt ? new Date(scheduledAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '–'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-500">Klasse</span><span className="text-white capitalize">{rideClass}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-zinc-700 pt-2 mt-1">
                <span className="text-white">Gesamt</span><span className="text-white">{price.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmation */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-white mb-2">Buchung bestätigt!</h2>
            <p className="text-zinc-400 text-sm mb-2">Buchungs-ID:</p>
            <div className="bg-zinc-900 border border-zinc-600 rounded-xl px-4 py-3 inline-block font-mono font-bold text-white text-lg mb-4">{bookingId}</div>
            <p className="text-zinc-400 text-sm mb-6">Bestätigung wurde an <strong className="text-white">{passengerEmail}</strong> gesendet.</p>
            <div className="space-y-2">
              <Button onClick={() => router.push(`/track/${bookingId}`)} className="w-full bg-white hover:bg-zinc-200 text-black font-bold rounded-2xl h-12">Fahrt verfolgen →</Button>
              <button onClick={() => router.push('/')} className="w-full rounded-2xl h-12 border border-zinc-700 text-zinc-300 hover:bg-zinc-900 transition-colors text-sm font-medium">Zurück zur Startseite</button>
            </div>
          </div>
        )}

        {bookingError && (
          <div className="bg-red-950 border border-red-800 rounded-2xl px-4 py-3 text-red-400 text-sm text-center">
            {bookingError}
          </div>
        )}

        {step < 4 && (
          <Button onClick={step === 3 ? handleBook : () => setStep(s => s + 1)} disabled={!canNext() || loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold rounded-2xl h-14 text-base disabled:opacity-40">
            {loading ? 'Buchung läuft...' : step === 3 ? 'Jetzt verbindlich buchen' : <span className="flex items-center justify-center gap-1">Weiter <ChevronRight className="w-5 h-5" /></span>}
          </Button>
        )}
      </div>
    </div>
  )
}
