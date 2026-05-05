import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isAccountRoute = createRouteMatcher(['/account(.*)'])

export const proxy = clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl

  // Admin routes: require Clerk login + admin email
  if (pathname.startsWith('/admin')) {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      const url = req.nextUrl.clone()
      url.pathname = '/sign-in'
      url.searchParams.set('redirect_url', pathname)
      return NextResponse.redirect(url)
    }

    const email = sessionClaims?.email as string | undefined
    const adminEmails = (process.env.ADMIN_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean)

    if (!email || !adminEmails.includes(email)) {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
    }

    return NextResponse.next()
  }

  // Account page: require any Clerk login
  if (isAccountRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)'],
}
