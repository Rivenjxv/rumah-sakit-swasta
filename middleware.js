import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

export function middleware(req) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl
  const url = req.nextUrl.clone()

  // Daftar halaman publik (tidak perlu token)
  const publicRoutes = ['/login', '/register']

  // Jika halaman publik, lanjut saja
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Jika tidak ada token → redirect ke login
  if (!token) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  try {
    // Verifikasi token
    verify(token, process.env.JWT_SECRET || 'secret123')
    return NextResponse.next()
  } catch {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}

export const config = {
  // Proteksi semua rute kecuali login, register, _next, favicon, dll.
  matcher: ['/((?!_next|favicon.ico|login|register|api).*)']
}
