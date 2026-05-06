'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const apply = (dark: boolean) => {
      document.documentElement.classList.toggle('dark', dark)
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    apply(mq.matches)
    mq.addEventListener('change', e => apply(e.matches))
    return () => mq.removeEventListener('change', e => apply(e.matches))
  }, [])

  return <>{children}</>
}
