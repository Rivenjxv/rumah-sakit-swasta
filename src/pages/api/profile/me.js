import { getUserFromToken } from '../../../utils/auth'
import allowCors from '../../../utils/cors'

async function handler(req, res) {
  const user = getUserFromToken(req) // ✅ tidak perlu await lagi

  console.log('user from token:', user)

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  return res.status(200).json(user)
}

export default allowCors(handler)
