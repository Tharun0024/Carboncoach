'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function CoachingSection() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4.5xl font-extrabold text-white tracking-tight font-sans">
          AI-Powered Coaching in Action
        </h2>
        <p className="mt-3 text-base text-slate-400">
          Our conversational model intercepts context, adapts targets, and coordinates solutions.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* User Message */}
        <motion.div 
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className="flex justify-end"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-slate-950 font-medium px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] border border-white/10 shadow-md">
            "I had to drive to work today because of heavy rain."
          </div>
        </motion.div>

        {/* Coach Insight */}
        <motion.div 
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className="flex justify-start"
        >
          <div className="glass-card text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-[85%] border border-white/5 shadow-md">
            "Excuses are normal. Rain makes transit tough. Let's offset this."
          </div>
        </motion.div>

        {/* Action Recommendation */}
        <motion.div 
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className="flex justify-start"
        >
          <div className="glass-card text-slate-200 border-emerald-500/20 px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-[85%] border shadow-md flex items-start space-x-2.5">
            <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Alternative Task assigned:</span>
              "Swap one short grocery trip tomorrow for a walk instead."
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
