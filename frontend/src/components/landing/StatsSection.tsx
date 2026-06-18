'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { TrendingDown, ShieldCheck, Users } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';

export default function StatsSection() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-white/5 bg-slate-950/20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Stat 1 */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
          className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CO₂ Saved</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              <AnimatedCounter value={45820} suffix=" kg" />
            </div>
            <p className="text-xs text-emerald-400 font-bold mt-2">+1,240 kg offsets loaded this week</p>
          </div>
        </motion.div>

        {/* Stat 2 */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.1 }}
          className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion Rate</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              <AnimatedCounter value={94} suffix="%" />
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-2">Assigned task adherence score</p>
          </div>
        </motion.div>

        {/* Stat 3 */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.2 }}
          className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col justify-between sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Climate Actions Completed</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              <AnimatedCounter value={1840} />
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-2">Active climate action members</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
