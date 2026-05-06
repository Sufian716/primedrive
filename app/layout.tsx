import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { BottomNav } from "@/components/layout/BottomNav"
import { ThemeProvider } from "@/components/ThemeProvider"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PrimeDrive",
  description: "Zuverlässige Fahrten zum Flughafen Frankfurt und in die ganze Region.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="de" className="h-full antialiased">
        {/* Inline script prevents dark-mode flash on load */}
        <head>
          <script dangerouslySetInnerHTML={{ __html: `(function(){if(window.matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.classList.add('dark')})()` }} />
        </head>
        <body className={`${geist.className} bg-background text-foreground min-h-screen pb-20`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  )
}
