import fs from 'fs'
import path from 'path'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

  const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true })

  form.parse(req, (err, fields, files) => {
    if (err || !files.avatar) return res.status(500).json({ message: 'Upload gagal' })

    const file = files.avatar[0] || files.avatar
    const fileName = path.basename(file.filepath)
    const url = `/uploads/${fileName}`

    return res.status(200).json({ url })
  })
}