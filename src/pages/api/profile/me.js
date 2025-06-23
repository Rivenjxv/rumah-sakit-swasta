import { getUserFromToken } from '../../../utils/auth'
import allowCors from '../../../utils/cors' // ⬅️ middleware ditambahkan

function handler(req, res) {
  console.log('req.headers.cookie:', req.headers.cookie)
  const user = getUserFromToken(req)
  console.log('user from token:', user)

  if (!user) return res.status(401).json({ message: 'Unauthorized' })
  return res.status(200).json(user)
}

export default allowCors(handler)
