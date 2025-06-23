import jwt from 'jsonwebtoken'

const SECRET_KEY = 'secret123'

export default function handler(req, res) {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    return res.status(200).json({ user: decoded })
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
