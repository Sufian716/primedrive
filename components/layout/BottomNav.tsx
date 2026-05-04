'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Car, MapPin, User } from 'lucide-react'

const links = [
  { href: '/', label: 'Start', icon: Home },
  { href: '/booking', label: 'Buchen', icon: Car },
  { href: '/track', label: 'Verfolgen', icon: MapPin },
  { href: '/account', label: 'Konto', icon: User },
]

export function BottomNav() {
  const path = usePathname()
  if (path.startsWith('/admin')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-colors min-w-[60px] relative ${active ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
              {active && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
