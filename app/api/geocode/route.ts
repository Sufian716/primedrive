import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') ?? ''
  if (query.length < 3) return NextResponse.json([])

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=7&addressdetails=0&accept-language=de`,
      { headers: { 'User-Agent': 'PrimeDrive/1.0' } }
    )
    const data = await res.json()
    const results = data.map((r: { display_name: string; lat: string; lon: string }) => ({
      address: r.display_name,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    }))
    return NextResponse.json(results)
  } catch {
    return NextResponse.json([])
  }
}
