'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function JourneySection() {
  const shouldReduceMotion = useReducedMotion();
  const journeySteps = [
    { day: 'Monday', title: 'Assessment', desc: 'AI audits transportation and utility routines via natural chat.' },
    { day: 'Tuesday', title: 'Insight', desc: 'Pinpoints transport hotspot responsible for 40% of emissions.' },
    { day: 'Wednesday', title: 'Action', desc: 'Assigns weekly challenge: swap one short car ride for a walk.' },
    { day: 'Friday', title: 'Progress', desc: 'Completes action, logs savings, and updates impact graph.' },
    { day: 'Sunday', title: 'Review', desc: 'Logs completion, updates week streak, prepares next target.' }
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4.5xl font-extrabold text-white tracking-tight font-sans">
          Your Weekly Journey
        </h2>
        <p className="mt-3 text-base text-slate-400">
          A week in the life of a CarbonCoach citizen.
        </p>
      </div>

      <div className="relative">
        {/* Horizontal connecting line on desktop */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-white/10 -translate-y-1/2 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
          {journeySteps.map((step, idx) => (
            <motion.div
              key={step.day}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : idx * 0.1 }}
              className="glass-card p-6 rounded-2xl text-left flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">{step.day}</span>
                  <Calendar className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
