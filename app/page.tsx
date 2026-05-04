import Link from "next/link"
import { Car, MapPin, Shield, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-5 pt-14 pb-10 text-white">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Car className="w-7 h-7" />
            <span className="text-2xl font-extrabold tracking-tight">PrimeDrive</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-3">
            Dein zuverlässiger Fahrservice
          </h1>
          <p className="text-blue-100 text-base mb-8">
            Pünktlich zum Flughafen Frankfurt — und überall sonst hin.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-4 rounded-2xl text-base shadow-lg hover:bg-blue-50 transition-colors w-full justify-center"
          >
            <Car className="w-5 h-5" />
            Jetzt Fahrt buchen
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="max-w-lg mx-auto w-full px-4 -mt-5">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <Link href="/booking?type=airport" className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 border-b border-gray-100">
            <div className="bg-blue-100 p-2.5 rounded-xl">✈️</div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Zum Flughafen</div>
              <div className="text-xs text-gray-400">Frankfurt FRA · Terminal 1 & 2</div>
            </div>
            <span className="ml-auto text-gray-300 text-lg">›</span>
          </Link>
          <Link href="/booking?type=city" className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 border-b border-gray-100">
            <div className="bg-green-100 p-2.5 rounded-xl">🏙️</div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Stadttransfer</div>
              <div className="text-xs text-gray-400">Frankfurt & Umgebung</div>
            </div>
            <span className="ml-auto text-gray-300 text-lg">›</span>
          </Link>
          <Link href="/track" className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
            <div className="bg-purple-100 p-2.5 rounded-xl">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Fahrt verfolgen</div>
              <div className="text-xs text-gray-400">Buchungs-ID eingeben</div>
            </div>
            <span className="ml-auto text-gray-300 text-lg">›</span>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-lg mx-auto w-full px-4 mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: <Clock className="w-5 h-5 text-blue-600" />, label: 'Pünktlich', sub: 'Garantiert' },
          { icon: <Shield className="w-5 h-5 text-green-600" />, label: 'Sicher', sub: 'Geprüfte Fahrer' },
          { icon: <Car className="w-5 h-5 text-purple-600" />, label: '24/7', sub: 'Verfügbar' },
        ].map((f) => (
          <div key={f.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="flex justify-center mb-1">{f.icon}</div>
            <div className="font-semibold text-gray-900 text-xs">{f.label}</div>
            <div className="text-xs text-gray-400">{f.sub}</div>
          </div>
        ))}
      </div>

      {/* Promo */}
      <div className="max-w-lg mx-auto w-full px-4 mt-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <div className="font-semibold text-amber-900 text-sm">Erste Fahrt 10% günstiger</div>
            <div className="text-xs text-amber-700">Code: WELCOME10 bei der Buchung eingeben</div>
          </div>
        </div>
      </div>
    </div>
  )
}
