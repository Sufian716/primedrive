import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/layout/BottomNav"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PrimeDrive – Dein Fahrservice",
  description: "Zuverlässige Fahrten zum Flughafen Frankfurt und in die ganze Region.",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a56db",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className={`${geist.className} bg-gray-50 min-h-screen pb-20`}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
