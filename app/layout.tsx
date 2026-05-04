import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/layout/BottomNav"

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
  themeColor: "#000000",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className={`${geist.className} bg-black min-h-screen pb-20`}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
