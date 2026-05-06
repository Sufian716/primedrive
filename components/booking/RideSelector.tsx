'use client'

import { RIDE_OPTIONS } from '@/types'
import type { RideClass } from '@/types'
import { calculatePrice } from '@/lib/pricing'

interface Props {
  selected: RideClass
  onSelect: (c: RideClass) => void
  distanceKm: number
}

export function RideSelector({ selected, onSelect, distanceKm }: Props) {
  return (
    <div className="space-y-2">
      {RIDE_OPTIONS.map((opt) => {
        const price = calculatePrice(opt.class, distanceKm)
        const active = selected === opt.class
        return (
          <button key={opt.class} onClick={() => onSelect(opt.class)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
              active ? 'border-foreground bg-muted' : 'border-border bg-card hover:border-foreground/40'
            }`}>
            <span className="text-2xl w-10 text-center">{opt.icon}</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-foreground text-sm">{opt.name}</div>
              <div className="text-xs text-muted-foreground">{opt.description} · bis {opt.maxPassengers} Pers.</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-base text-foreground">{price.toFixed(2)} €</div>
              <div className="text-xs text-muted-foreground">ca. {opt.eta} Min.</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
