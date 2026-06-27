import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge-compatible middleware — no crypto, just checks cookie presence.
// Full signature + expiry verification happens in layout.tsx and API routes (Node.js runtime).
export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const cookie = request.cookies.get('admin_session')?.value

  if (isLoginPage) {
    // Already logged in → send to dashboard
    if (cookie) return NextResponse.redirect(new URL('/admin', request.url))
    return NextResponse.next()
  }

  if (isAdminRoute && !cookie) {
    // No cookie → send to login
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
