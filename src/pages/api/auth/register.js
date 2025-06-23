import fs from 'fs'
import path from 'path'

const usersFile = path.resolve(process.cwd(), 'src/pages/api/auth/users.json')

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { name, email, password } = req.body
  if (!email || !password || !name) return res.status(400).json({ message: 'Lengkapi semua field' })

  const fileData = fs.readFileSync(usersFile)
  const users = JSON.parse(fileData)

  const exists = users.find(u => u.email === email)
  if (exists) return res.status(409).json({ message: 'Email sudah terdaftar' })

  users.push({ name, email, password })
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2)) // simpan kembali ke file

  return res.status(200).json({ token: 'token123', name, email })
}
