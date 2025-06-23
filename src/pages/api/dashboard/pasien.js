export default function handler(req, res) {
  if (req.method === 'GET') {
    // Contoh data statis (bisa dihubungkan ke DB nantinya)
    return res.status(200).json({ jumlah: 87 })
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}