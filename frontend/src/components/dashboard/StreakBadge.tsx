import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streakCount: number;
}

export function StreakBadge({ streakCount }: StreakBadgeProps) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 text-center relative overflow-hidden flex flex-col items-center justify-center shadow-xl shadow-black/25">
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/5">
        <Flame className="w-7 h-7 text-emerald-400 animate-pulse fill-emerald-500/25" />
      </div>

      <div className="text-5xl font-extrabold text-white tracking-tight">{streakCount}</div>
      <div className="text-sm font-bold text-emerald-400 mt-2 uppercase tracking-wider">Week Streak</div>
      <p className="text-xs text-slate-400 mt-2 max-w-[200px] mx-auto leading-relaxed">
        Outstanding! You have logged actions for {streakCount} weeks in a row.
      </p>
    </div>
  );
}
