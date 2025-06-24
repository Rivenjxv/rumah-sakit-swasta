import { NextResponse } from 'next/server'

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const tokenCookie = cookieHeader
    .split('; ')
    .find(row => row.startsWith('token='))

  const token = tokenCookie ? tokenCookie.split('=')[1] : null

  return NextResponse.json({
    token: token || null,
    rawCookies: cookieHeader || 'no cookie received',
    success: !!token
  })
}
