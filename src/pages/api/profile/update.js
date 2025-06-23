import fs from 'fs'
import path from 'path'
import { verify } from 'jsonwebtoken'
import * as cookie from 'cookie'

const usersFile = path.resolve(process.cwd(), 'src/pages/api/auth/users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.token
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  let decoded
  try {
    decoded = verify(token, JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const { email } = decoded
  const { newPassword, avatarBase64 } = req.body

  let users = []
  try {
    const data = fs.readFileSync(usersFile)
    users = JSON.parse(data)
  } catch (err) {
    return res.status(500).json({ message: 'Failed to read users file' })
  }

  const index = users.findIndex(u => u.email === email)
  if (index === -1) return res.status(404).json({ message: 'User not found' })

  if (newPassword) users[index].password = newPassword
  if (avatarBase64) users[index].avatar = avatarBase64

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
  return res.status(200).json({ message: 'Profile updated successfully' })
}
