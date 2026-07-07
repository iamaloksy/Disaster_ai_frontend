/**
 * components/PredictionChart.jsx
 * -----------------------------------------------------------------------
 * Reusable chart component built on Recharts. Renders either a bar
 * chart (disaster type distribution) or a pie chart (severity
 * distribution) depending on the `type` prop.
 */

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = {
  Fire: '#FF4757',
  Flood: '#4D8EFF',
  Earthquake: '#FFA734',
  Cyclone: '#94A7B8',
  Landslide: '#2A9D6B',
  Normal: '#3D4F61',
  Unknown: '#3D4F61',
  Critical: '#FF4757',
  High: '#FFA734',
  Medium: '#4D8EFF',
  Low: '#3DD68C',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 shadow-card">
      <p className="text-sm font-medium text-mist-100">{label}</p>
      <p className="text-sm text-mist-300">{payload[0].value} reports</p>
    </div>
  )
}

export default function PredictionChart({ type = 'bar', data, title }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value }))

  if (chartData.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-mist-200 mb-4">{title}</h3>
        <div className="h-56 flex items-center justify-center text-mist-400 text-sm">
          No data yet — submit a report to see analytics here.
        </div>
      </div>
    )
  }

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-mist-200 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        {type === 'bar' ? (
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2A38" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94A7B8', fontSize: 12 }} axisLine={{ stroke: '#2A3949' }} tickLine={false} />
            <YAxis tick={{ fill: '#94A7B8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.name] || '#4D8EFF'} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.name] || '#4D8EFF'} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#94A7B8' }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
