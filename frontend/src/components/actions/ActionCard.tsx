'use client';

import { useState } from 'react';
import { Action } from '@/types';
import { Car, Zap, Flame, Leaf, CheckCircle2, AlertCircle } from 'lucide-react';
import SkippedReasonForm from './SkippedReasonForm';

interface ActionCardProps {
  action: Action;
}

const CATEGORY_MAP = {
  transport: { icon: Car, label: 'Transport', color: 'from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20' },
  energy: { icon: Zap, label: 'Energy', color: 'from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20' },
  food: { icon: Flame, label: 'Dietary', color: 'from-indigo-500/10 to-violet-500/10 text-indigo-400 border-indigo-500/20' },
};

export function ActionCard({ action }: ActionCardProps) {
  const [isSkipped, setIsSkipped] = useState(false);

  const handleSkip = () => {
    setIsSkipped(true);
  };

  const catMeta = CATEGORY_MAP[action.category as keyof typeof CATEGORY_MAP] || {
    icon: Leaf,
    label: 'Action',
    color: 'from-slate-500/10 to-zinc-500/10 text-slate-400 border-slate-500/20',
  };
  const Icon = catMeta.icon;

  const leftBarColor = action.category === 'transport' 
    ? 'from-emerald-400 to-teal-500' 
    : action.category === 'energy' 
      ? 'from-cyan-400 to-blue-500' 
      : 'from-indigo-400 to-violet-500';

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden shadow-xl shadow-black/25">
      {/* Category Accent Border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${leftBarColor}`} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* Info */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg border text-xs font-semibold bg-gradient-to-r ${catMeta.color}`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{catMeta.label}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{action.difficulty}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight leading-snug font-sans">{action.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{action.description}</p>
        </div>

        {/* Metric Badge */}
        <div className="text-right flex-shrink-0 self-start sm:self-center ml-0 sm:ml-4 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
          <div className="text-base font-extrabold text-emerald-400 font-sans">-{action.impact_kgco2e_estimate} kg CO₂e</div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Weekly Carbon Savings</div>
        </div>
      </div>
      
      {/* Active buttons */}
      {action.status === 'assigned' && !isSkipped && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            className="flex-grow flex items-center justify-center btn-primary font-bold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm"
            style={{ minHeight: '44px' }}
            aria-label={`Mark action '${action.title}' as complete`}
          >
            I did it!
          </button>
          <button
            onClick={handleSkip}
            className="flex-grow flex items-center justify-center btn-secondary font-semibold py-2.5 px-4 rounded-xl transition-all duration-200"
            style={{ minHeight: '44px' }}
            aria-label={`Skip action '${action.title}' for this week`}
          >
            Skip this week
          </button>
        </div>
      )}

      {/* Skipped Input Box */}
      {isSkipped && <SkippedReasonForm actionId={action.id} />}

      {/* Finished States */}
      {action.status === 'completed' && (
        <div className="mt-6 flex items-center justify-center space-x-2 font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 py-3 px-4 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400">Completed! Great job!</span>
        </div>
      )}
      
      {action.status === 'skipped' && !isSkipped && (
        <div className="mt-6 flex items-center justify-center space-x-2 font-bold text-slate-400 bg-white/5 border border-white/10 py-3 px-4 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <span>You skipped this action.</span>
        </div>
      )}
    </div>
  );
}
