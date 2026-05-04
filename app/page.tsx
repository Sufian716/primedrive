import Link from "next/link"
import { Car, MapPin, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-2 max-w-lg mx-auto w-full">
        <span className="text-white text-2xl font-black tracking-tight">PrimeDrive</span>
      </div>

      {/* Hero */}
      <div className="px-5 pt-8 pb-10 max-w-lg mx-auto w-full">
        <h1 className="text-white text-4xl font-black leading-tight mb-2">
          Wohin<br />soll es gehen?
        </h1>
        <p className="text-zinc-400 text-sm mb-8">
          Pünktlich. Zuverlässig. Überall in Frankfurt.
        </p>

        <Link
          href="/booking"
          className="flex items-center gap-3 bg-white text-black font-bold px-5 py-4 rounded-2xl text-base w-full hover:bg-zinc-100 active:scale-95 transition-all"
        >
          <div className="bg-black rounded-xl p-2">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span>Fahrt buchen</span>
          <ChevronRight className="w-5 h-5 ml-auto text-zinc-400" />
        </Link>
      </div>

      {/* Quick actions */}
      <div className="px-5 max-w-lg mx-auto w-full space-y-2">
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3">Schnellzugriff</p>

        <Link href="/booking?type=airport"
          className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 hover:bg-zinc-800 active:scale-95 transition-all">
          <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">✈️</div>
          <div>
            <div className="font-semibold text-white text-sm">Zum Flughafen</div>
            <div className="text-xs text-zinc-500">Frankfurt FRA · Terminal 1 & 2</div>
          </div>
          <ChevronRight className="w-4 h-4 ml-auto text-zinc-600" />
        </Link>

        <Link href="/booking?type=city"
          className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 hover:bg-zinc-800 active:scale-95 transition-all">
          <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">🏙️</div>
          <div>
            <div className="font-semibold text-white text-sm">Stadttransfer</div>
            <div className="text-xs text-zinc-500">Frankfurt & Umgebung</div>
          </div>
          <ChevronRight className="w-4 h-4 ml-auto text-zinc-600" />
        </Link>

        <Link href="/track"
          className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 hover:bg-zinc-800 active:scale-95 transition-all">
          <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Fahrt verfolgen</div>
            <div className="text-xs text-zinc-500">Buchungs-ID eingeben</div>
          </div>
          <ChevronRight className="w-4 h-4 ml-auto text-zinc-600" />
        </Link>
      </div>

      {/* Promo */}
      <div className="px-5 mt-5 max-w-lg mx-auto w-full">
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shrink-0">🎁</div>
          <div>
            <div className="font-semibold text-white text-sm">Erste Fahrt 10% günstiger</div>
            <div className="text-xs text-zinc-400">Code: <span className="text-white font-mono">WELCOME10</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
