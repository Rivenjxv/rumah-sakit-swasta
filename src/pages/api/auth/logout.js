import cookie from 'cookie'
import allowCors from '../../../utils/cors' // ⬅️ middleware ditambahkan

function handler(req, res) {
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  }))
  return res.status(200).json({ message: 'Logout berhasil' })
}

export default allowCors(handler)
