import { NextRequest, NextResponse } from 'next/server'
import { getAllBookings, seedDemoBookings } from '@/lib/store'

export async function GET(_req: NextRequest) {
  seedDemoBookings()
  return NextResponse.json(getAllBookings())
}
