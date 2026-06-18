'use client';

interface RegionalComparisonProps {
  totalAnnual: number;
}

export default function RegionalComparison({ totalAnnual }: RegionalComparisonProps) {
  return (
    <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-400">Regional Comparison</span>
        <span className={`font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${totalAnnual <= 1900 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
          {totalAnnual <= 1900 ? 'Below India Avg' : 'Above India Avg'}
        </span>
      </div>
      
      <div className="space-y-2.5">
        {/* User footprint progress bar */}
        <div>
          <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            <span>Your Footprint</span>
            <span>{Math.round(totalAnnual).toLocaleString()} kg/year</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${totalAnnual <= 1900 ? 'from-emerald-500 to-teal-400' : 'from-amber-500 to-red-400'}`}
              style={{ width: `${Math.min((totalAnnual / 3000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* India Average Reference Line */}
        <div>
          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>India Average</span>
            <span>1,900 kg/year</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
            <div className="h-full rounded-full bg-slate-500" style={{ width: `${(1900 / 3000) * 100}%` }} />
          </div>
        </div>

        {/* Global Sustainability Target Line */}
        <div>
          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Global Target</span>
            <span>2,300 kg/year</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
            <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(2300 / 3000) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
