import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') ?? ''
  if (query.length < 3) return NextResponse.json([])

  const key = process.env.OPENCAGE_API_KEY
  if (!key) {
    // Fallback: statische Frankfurt-Orte für Demo
    const fallback = [
      { address: 'Flughafen Frankfurt am Main (FRA)', lat: 50.0379, lng: 8.5622 },
      { address: 'Frankfurt Hauptbahnhof', lat: 50.1071, lng: 8.6637 },
      { address: 'Frankfurt Messe', lat: 50.1136, lng: 8.6492 },
      { address: 'Römerberg, Frankfurt', lat: 50.1106, lng: 8.6822 },
      { address: 'Sachsenhausen, Frankfurt', lat: 50.0988, lng: 8.6847 },
    ].filter((p) => p.address.toLowerCase().includes(query.toLowerCase()))
    return NextResponse.json(fallback)
  }

  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${key}&language=de&countrycode=de&limit=6`
  )
  const data = await res.json()
  const results = (data.results ?? []).map((r: { formatted: string; geometry: { lat: number; lng: number } }) => ({
    address: r.formatted,
    lat: r.geometry.lat,
    lng: r.geometry.lng,
  }))
  return NextResponse.json(results)
}
