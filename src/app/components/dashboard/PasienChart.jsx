'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const data = [
  { name: 'Sen', jumlah: 40 },
  { name: 'Sel', jumlah: 55 },
  { name: 'Rab', jumlah: 70 },
  { name: 'Kam', jumlah: 50 },
  { name: 'Jum', jumlah: 66 },
  { name: 'Sab', jumlah: 32 },
  { name: 'Min', jumlah: 45 },
]

export default function PasienChart() {
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h5 className="mb-3 fw-bold text-primary">Total Pasien Mingguan</h5>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="jumlah" fill="#1e88e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
