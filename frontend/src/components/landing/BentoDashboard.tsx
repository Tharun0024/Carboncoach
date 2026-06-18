'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Activity, Zap, CheckCircle, MessageCircle } from 'lucide-react';

export default function BentoDashboard() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="lg:col-span-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[480px] w-full"
      >
        {/* Bento Card 1: Footprint */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-[150px]">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Footprint</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">1,000 kg</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">CO₂e / Year Estimate</div>
          </div>
        </div>

        {/* Bento Card 2: Weekly Goal */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-[150px]">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Weekly Goal</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-tight">Swap Car for Bike</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1">-5.4 kg offset target</div>
          </div>
        </div>

        {/* Bento Card 3: Progress */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-[150px]">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Progress</span>
            <CheckCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">75%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full w-[75%]" />
            </div>
          </div>
        </div>

        {/* Bento Card 4: AI Coach */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-[150px]">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>AI Coach</span>
            <MessageCircle className="w-4 h-4 text-fuchsia-400" />
          </div>
          <div className="text-[10px] text-slate-300 italic leading-relaxed line-clamp-3">
            "Try walking to the local grocery tomorrow to offset yesterday's commute."
          </div>
        </div>
      </motion.div>
    </div>
  );
}
