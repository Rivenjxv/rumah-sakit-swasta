import { verify } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import * as cookie from 'cookie'

export function getUserFromToken(req) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '')
    const token = cookies.token
    if (!token || token === 'undefined') return null


    const decoded = verify(token, process.env.JWT_SECRET || 'secret123')
    const email = decoded.email

    console.log('Decoded token:', decoded)
    console.log('Decoded email:', email)

    const filePath = path.resolve(process.cwd(), 'src/pages/api/auth/users.json') // ✅ fix path
    const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    console.log('Loaded users:', users.map(u => u.email))

    return users.find(u => u.email === email) || null
  } catch (err) {
    console.error('getUserFromToken error:', err)
    return null
  }
}
