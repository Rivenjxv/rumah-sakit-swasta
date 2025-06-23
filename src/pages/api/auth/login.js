import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import * as cookie from 'cookie'
import allowCors from '../../../utils/cors' // ⬅️ middleware ditambahkan

const usersFile = path.resolve(process.cwd(), 'src/pages/api/auth/users.json')
const secret = process.env.JWT_SECRET || 'secret123'

function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { email, password } = req.body

  let users = []
  try {
    const fileData = fs.readFileSync(usersFile)
    users = JSON.parse(fileData)
  } catch (err) {
    console.error('Error reading users.json:', err)
    return res.status(500).json({ message: 'Gagal membaca data pengguna' })
  }

  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return res.status(401).json({ message: 'Email atau password salah' })

  const token = jwt.sign({ name: user.name, email: user.email, avatar: user.avatar || '' }, secret, {
    expiresIn: '2d'
  })

  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 2,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production'
  }))

  return res.status(200).json({ user })
}

export default allowCors(handler)
