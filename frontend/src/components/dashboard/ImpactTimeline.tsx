'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const data = [
  { name: 'Week 1', savings: 0 },
  { name: 'Week 2', savings: 5 },
  { name: 'Week 3', savings: 12 },
  { name: 'Week 4', savings: 15 },
  { name: 'Week 5', savings: 25 },
];

export function ImpactTimeline() {
  return (
    <div
      role="img"
      aria-label="A line chart showing cumulative CO2 savings over the past 5 weeks, starting at 0 and increasing to 25 kg."
      className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl shadow-black/25"
    >
      <div className="mb-4">
        <span className="text-2xl font-bold text-white tracking-tight">25.0 kg</span>
        <span className="text-xs text-slate-400 block mt-0.5">Total Offsets Accumulated</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis 
            label={{ value: 'kg CO₂e Saved', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12, offset: 5 }} 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#f4f4f5'
            }}
          />
          <Legend 
            formatter={(value) => <span className="text-xs font-semibold text-slate-300 ml-1">{value}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="savings" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
            activeDot={{ r: 7, fill: '#34d399', strokeWidth: 2, stroke: '#020617' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
