'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plane, Car, Zap, Beef } from 'lucide-react';
import { useAssessment } from '@/hooks/useAssessment';
import RegionalComparison from './RegionalComparison';

// SaaS organic dark palette: Emerald, Cyan, Indigo, Fuchsia
const COLORS = ['#10b981', '#06b6d4', '#6366f1', '#d946ef'];

export function FootprintCard() {
  const { assessments, isLoading } = useAssessment();

  // Get the latest assessment
  const latestAssessment = assessments && assessments.length > 0 ? assessments[assessments.length - 1] : null;

  // Convert monthly values from backend to annual values for the dashboard comparison
  const totalAnnual = latestAssessment ? latestAssessment.total_kg_co2e * 12 : 1000;

  const transportValue = latestAssessment ? (latestAssessment.breakdown.transport || 0) * 12 : 400;
  const energyValue = latestAssessment ? (latestAssessment.breakdown.energy || 0) * 12 : 300;
  const foodValue = latestAssessment ? (latestAssessment.breakdown.food || 0) * 12 : 200;
  const otherValue = latestAssessment ? (latestAssessment.breakdown.other || 0) * 12 : 100;

  const chartData = [
    { name: 'Transport', value: transportValue, icon: Car },
    { name: 'Energy', value: energyValue, icon: Zap },
    { name: 'Food', value: foodValue, icon: Beef },
    { name: 'Other', value: otherValue, icon: Plane },
  ];

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl shadow-black/25 flex items-center justify-center h-[350px]">
        <div className="text-slate-400 text-sm font-medium animate-pulse">Loading footprint assessment...</div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`A pie chart showing your carbon footprint breakdown. Transport is ${Math.round(transportValue)} kg, Energy is ${Math.round(energyValue)} kg, Food is ${Math.round(foodValue)} kg, and Other is ${Math.round(otherValue)} kg.`}
      aria-describedby="chart-description"
      className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl shadow-black/25"
    >
      <span id="chart-description" className="sr-only">
        The chart breakdown is as follows: Transport is {Math.round(transportValue)} kilograms, Energy is {Math.round(energyValue)} kilograms, Food is {Math.round(foodValue)} kilograms, and Other is {Math.round(otherValue)} kilograms.
      </span>
      <div className="mb-4">
        <span className="text-2xl font-bold text-white tracking-tight">{Math.round(totalAnnual).toLocaleString()} kg</span>
        <span className="text-xs text-slate-400 block mt-0.5">Total CO₂e / Year Estimate</span>
      </div>

      <ResponsiveContainer width="100%" height={260} data-testid="responsive-container">
        <PieChart data-testid="pie-chart">
          <Pie
            data={chartData}
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
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${Math.round(Number(value))} kg CO₂e`, 'Emissions']}
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

      {/* India & Global Reference Comparison Meter */}
      <RegionalComparison totalAnnual={totalAnnual} />
    </div>
  );
}
