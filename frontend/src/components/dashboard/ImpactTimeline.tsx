'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Assessment } from '@/types';

interface ImpactTimelineProps {
  assessments?: Assessment[];
}

export function ImpactTimeline({ assessments }: ImpactTimelineProps) {
  const timelineData = assessments && assessments.length > 0
    ? assessments
        .slice()
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((a, i) => ({
          name: `Assessment ${i + 1}`,
          footprint: Math.round(a.total_kg_co2e * 12),
        }))
    : [];

  const latestAnnual = timelineData.length > 0
    ? timelineData[timelineData.length - 1].footprint
    : 0;

  if (timelineData.length === 0) {
    return (
      <div
        role="status"
        className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl shadow-black/25 text-center"
      >
        <p className="text-slate-400 text-sm">Complete your first assessment to see your carbon trend over time.</p>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`A line chart showing carbon footprint trends across ${timelineData.length} assessments. Latest annual footprint is ${latestAnnual.toLocaleString()} kg CO2e.`}
      className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl shadow-black/25"
    >
      <div className="mb-4">
        <span className="text-2xl font-bold text-white tracking-tight">{latestAnnual.toLocaleString()} kg</span>
        <span className="text-xs text-slate-400 block mt-0.5">Latest Annual Footprint</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timelineData}>
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
            label={{ value: 'kg CO₂e / year', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12, offset: 5 }}
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
            dataKey="footprint"
            name="Annual Footprint"
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
