import Link from 'next/link'
import { ShieldOff } from 'lucide-react'

export default function AdminUnauthorized() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldOff className="w-8 h-8 text-zinc-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Kein Zugriff</h1>
        <p className="text-zinc-500 text-sm mb-6">Dein Account ist nicht als Admin eingetragen.</p>
        <Link href="/" className="inline-block bg-white text-black font-bold px-5 py-3 rounded-2xl text-sm hover:bg-zinc-200 transition-colors">
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}
