'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import BentoDashboard from './BentoDashboard';

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[520px]">
        
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Small Badge */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs sm:text-sm text-emerald-400 font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Carbon Coaching</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
          >
            Decarbonize<br className="hidden sm:inline" /> Your Life.<br />
            <span className="text-gradient">One Week At A Time.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl"
          >
            Calculate your footprint through chat, get assigned one achievable weekly habit change, and log real offsets — no sterile sheets required.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Link
              href="/chat"
              className="btn-primary inline-flex items-center justify-center text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-300 group"
              style={{ minHeight: '48px' }}
              aria-label="Calculate My Footprint button"
            >
              <span>Calculate My Footprint</span>
              <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="btn-secondary inline-flex items-center justify-center text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-300"
              style={{ minHeight: '48px' }}
            >
              See My Impact
            </Link>
          </motion.div>
        </div>

        {/* Right Column (Bento Dashboard Preview) */}
        <BentoDashboard />

      </div>
    </section>
  );
}
