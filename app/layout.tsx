import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
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
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: '#09090b',
          colorInputBackground: '#18181b',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: '#a1a1aa',
          colorPrimary: '#ffffff',
          colorNeutral: '#ffffff',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'bg-zinc-900 border border-zinc-800 shadow-none',
          headerTitle: 'text-white font-black',
          headerSubtitle: 'text-zinc-400',
          socialButtonsBlockButton: 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700',
          formButtonPrimary: 'bg-white text-black hover:bg-zinc-200 font-bold',
          footerActionLink: 'text-white hover:text-zinc-300',
          identityPreviewText: 'text-white',
          formFieldInput: 'bg-zinc-800 border-zinc-700 text-white',
          formFieldLabel: 'text-zinc-400',
          dividerLine: 'bg-zinc-700',
          dividerText: 'text-zinc-500',
        },
      }}
    >
      <html lang="de" className="h-full antialiased">
        <body className={`${geist.className} bg-black min-h-screen pb-20`}>
          {children}
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  )
}
