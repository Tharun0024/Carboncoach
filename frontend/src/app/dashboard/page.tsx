'use client';

import { FootprintCard } from "@/components/dashboard/FootprintCard";
import { ImpactTimeline } from "@/components/dashboard/ImpactTimeline";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { ActionCard } from "@/components/actions/ActionCard";
import { useActions } from "@/hooks/useActions";
import { useAssessment } from "@/hooks/useAssessment";
import { motion, useReducedMotion } from 'framer-motion';
import { Trophy, BarChart3, Target, Leaf } from 'lucide-react';
import { useMemo } from 'react';

function computeStreak(history?: Array<{ status: string }>) {
  if (!history || history.length === 0) return 0;
  let streak = 0;
  for (const action of history) {
    if (action.status === 'completed') streak++;
    else break;
  }
  return streak;
}

export default function DashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const { currentAction, actionHistory, isLoading: actionsLoading } = useActions();
  const { assessments, isLoading: assessmentsLoading } = useAssessment();

  const streakCount = useMemo(() => computeStreak(actionHistory), [actionHistory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow flex flex-col justify-start bg-[#020617] text-slate-100">
      {/* Header section */}
      <motion.header 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Climate Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1">Track assessments, log action cards, and inspect cumulative offsets.</p>
        </div>
        <div className="flex items-center space-x-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 self-start sm:self-center shadow-sm">
          <Trophy className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level 3</div>
            <div className="text-sm font-bold text-white">Carbon Conqueror</div>
          </div>
        </div>
      </motion.header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Timeline & Action) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Action section */}
          <motion.section 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.15 }}
            aria-labelledby="current-action-heading"
            className="relative"
          >
            <div className="flex items-center space-x-2.5 mb-4">
              <Target className="w-5 h-5 text-emerald-400" />
              <h2 id="current-action-heading" className="text-xl font-bold text-white">Active Assignment</h2>
            </div>
            {actionsLoading ? (
              <div className="glass-card p-6 rounded-2xl border border-white/10 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-800 rounded w-full"></div>
              </div>
            ) : currentAction ? (
              <ActionCard action={currentAction} />
            ) : (
              <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                <p className="text-slate-400 text-sm">Start a chat with your AI coach to get your first weekly action.</p>
              </div>
            )}
          </motion.section>

          {/* Timeline section */}
          <motion.section 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
            aria-labelledby="impact-timeline-heading"
          >
            <div className="flex items-center space-x-2.5 mb-4">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h2 id="impact-timeline-heading" className="text-xl font-bold text-white">Footprint Trend</h2>
            </div>
            <ImpactTimeline assessments={assessments} />
          </motion.section>
        </div>

        {/* Right Aside Column (Footprint & Streak) */}
        <div className="space-y-8">
          
          {/* Footprint Breakdown */}
          <motion.section 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.25 }}
            aria-labelledby="footprint-breakdown-heading"
          >
            <div className="flex items-center space-x-2.5 mb-4">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <h2 id="footprint-breakdown-heading" className="text-xl font-bold text-white">Footprint Breakdown</h2>
            </div>
            <FootprintCard />
          </motion.section>

          {/* Progress Streak */}
          <motion.section 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
            aria-labelledby="progress-streak-heading"
          >
            <h2 id="progress-streak-heading" className="text-xl font-bold text-white mb-4">Current Progress</h2>
            <StreakBadge streakCount={streakCount} />
          </motion.section>
        </div>
      </div>
    </div>
  );
}
