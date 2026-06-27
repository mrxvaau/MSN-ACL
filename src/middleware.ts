import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'
  const cookie = request.cookies.get('admin_session')?.value

  // Always pass x-pathname header so admin/layout.tsx can detect the login page
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  if (isLoginPage) {
    // Already logged in → send to dashboard
    if (cookie) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    // Not logged in → show login page (no redirect)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (isAdminRoute && !cookie) {
    // No cookie → send to login (no callbackUrl needed, keep it simple)
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
