'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const data = [
  { hari: 'Senin', total: 35 },
  { hari: 'Selasa', total: 50 },
  { hari: 'Rabu', total: 45 },
  { hari: 'Kamis', total: 60 },
  { hari: 'Jumat', total: 40 },
  { hari: 'Sabtu', total: 20 },
  { hari: 'Minggu', total: 25 }
]

export default function LineChartPasien() {
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h5 className="mb-3 fw-bold text-primary">Pendaftaran Pasien Mingguan</h5>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hari" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#4caf50" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
