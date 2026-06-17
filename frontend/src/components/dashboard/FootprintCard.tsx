'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plane, Car, Zap, Beef } from 'lucide-react';

// Mock data for demonstration
const data = [
  { name: 'Transport', value: 400, icon: Car },
  { name: 'Energy', value: 300, icon: Zap },
  { name: 'Food', value: 200, icon: Beef },
  { name: 'Other', value: 100, icon: Plane }, // Using Plane as a placeholder for 'Other'
];

// SaaS organic dark palette: Emerald, Cyan, Indigo, Fuchsia
const COLORS = ['#10b981', '#06b6d4', '#6366f1', '#d946ef'];

export function FootprintCard() {
  return (
    <div
      role="img"
      aria-label="A pie chart showing your carbon footprint breakdown. Transport is 400 kg, Energy is 300 kg, Food is 200 kg, and Other is 100 kg."
      className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl shadow-black/25"
    >
      <div className="mb-4">
        <span className="text-2xl font-bold text-white tracking-tight">1,000 kg</span>
        <span className="text-xs text-slate-400 block mt-0.5">Total CO₂e / Year Estimate</span>
      </div>

      <ResponsiveContainer width="100%" height={260} data-testid="responsive-container">
        <PieChart data-testid="pie-chart">
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={75}
            innerRadius={50} // Donut chart style
            paddingAngle={4}
            fill="#8884d8"
            dataKey="value"
            data-testid="pie"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} kg CO₂e`, 'Emissions']}
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#f4f4f5'
            }}
          />
          <Legend 
            iconType="circle" 
            formatter={(value) => <span className="text-xs font-semibold text-slate-300 ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
