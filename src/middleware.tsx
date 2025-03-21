import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  const authToken = headers.get('cookie')?.includes('auth-token')
  
  const { pathname } = new URL(request.url)
  
  // Redirect authenticated users away from login
  if (authToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/create', request.url), 302)
  }
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/about', '/', '/demo', '/save']
  
  // Redirect unauthenticated users to login
  if (!authToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url), 302)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/create', '/save', '/settings/:path*', '/templates', '/projects', '/analytics', '/library', '/about', '/demo'],
}

