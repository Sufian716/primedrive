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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link key={href} href={href} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icon className={`w-5 h-5 ${active ? 'fill-blue-100' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
