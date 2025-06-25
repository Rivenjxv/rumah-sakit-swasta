import * as cookie from 'cookie'
import { jwtDecode } from 'jwt-decode'

export function getUserFromToken(req) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '')
    const token = cookies.token

    if (!token || token === 'undefined') return null

    const decoded = jwtDecode(token)
    console.log('Decoded JWT:', decoded)

    return {
      name: decoded.name || decoded.Nama || '',
      email: decoded.email || decoded.Email || decoded.sub || '',
      role: decoded.role || decoded.Role || '',
    }
  } catch (err) {
    console.error('JWT decode error:', err)
    return null
  }
}

