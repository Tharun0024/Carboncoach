'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquare, Cpu, TrendingDown } from 'lucide-react';

export default function WhySection() {
  const shouldReduceMotion = useReducedMotion();
  const whyReasons = [
    {
      title: 'Conversation First',
      description: 'Audits are completed through natural conversation with our AI. No long, boring spreadsheet worksheets or sterile forms.',
      icon: MessageSquare,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
    },
    {
      title: 'Personalized Actions',
      description: 'Instead of generic tips, receive one weekly carbon-saving challenge custom tailored to your actual emission categories.',
      icon: Cpu,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
    },
    {
      title: 'Measurable Impact',
      description: 'See exactly how much CO₂e you offset with each completed week. Keep tabs on aggregate gains through responsive trackers.',
      icon: TrendingDown,
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5'
    }
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4.5xl font-extrabold text-white tracking-tight font-sans">
          Why CarbonCoach?
        </h2>
        <p className="mt-3 text-base text-slate-400">
          Ditch generic, passive footprint calculations for conversational accountability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {whyReasons.map((reason, idx) => {
          const Icon = reason.icon;
          return (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : idx * 0.1 }}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between text-left relative overflow-hidden"
            >
              <div>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-6 ${reason.color}`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{reason.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
