'use client'

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const data = [
  { name: 'Antibiotik', value: 24 },
  { name: 'Analgesik', value: 18 },
  { name: 'Vitamin', value: 12 },
  { name: 'Obat Batuk', value: 8 },
]

const COLORS = ['#1976d2', '#0288d1', '#43a047', '#fbc02d']

export default function ObatPieChart() {
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h5 className="mb-3 fw-bold text-primary">Distribusi Permintaan Obat</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
