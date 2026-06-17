'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  ArrowRight, 
  Activity, 
  Zap, 
  Users,
  Calendar,
  CheckCircle,
  HelpCircle,
  MessageCircle,
  Cpu
} from 'lucide-react';

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2; // seconds
    const startTime = performance.now();
    let animationFrame: number;

    const updateCount = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const ease = progress * (2 - progress); // Ease out quad
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
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

  const journeySteps = [
    { day: 'Monday', title: 'Assessment', desc: 'AI audits transportation and utility routines via natural chat.' },
    { day: 'Tuesday', title: 'Insight', desc: 'Pinpoints transport hotspot responsible for 40% of emissions.' },
    { day: 'Wednesday', title: 'Action', desc: 'Assigns weekly challenge: swap one short car ride for a walk.' },
    { day: 'Friday', title: 'Progress', desc: 'Completes action, logs savings, and updates impact graph.' },
    { day: 'Sunday', title: 'Review', desc: 'Logs completion, updates week streak, prepares next target.' }
  ];

  return (
    <div className="w-full flex-grow flex flex-col justify-start overflow-x-hidden bg-[#020617] text-slate-100 relative">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none -z-10" />

      {/* 1. Hero Section (True 2-column Bento Layout) */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[520px]">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs sm:text-sm text-emerald-400 font-bold uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Carbon Coaching</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
            >
              Decarbonize<br className="hidden sm:inline" /> Your Life.<br />
              <span className="text-gradient">One Week At A Time.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl"
            >
              Calculate your footprint through chat, get assigned one achievable weekly habit change, and log real offsets — no sterile sheets required.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
          <div className="lg:col-span-6 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
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

        </div>
      </section>

      {/* 2. Stats Section (3-column layout) */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-white/5 bg-slate-950/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Stat 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.1 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.2 }}
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

      {/* 3. Why CarbonCoach? Section */}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
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

      {/* 4. Example Weekly Journey Section (Connected Timeline) */}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
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

      {/* 5. AI Powered Coaching Section (Chat Cards) */}
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
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-end"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-slate-950 font-medium px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] border border-white/10 shadow-md">
              "I had to drive to work today because of heavy rain."
            </div>
          </motion.div>

          {/* Coach Insight */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-start"
          >
            <div className="glass-card text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-[85%] border border-white/5 shadow-md">
              "Excuses are normal. Rain makes transit tough. Let's offset this."
            </div>
          </motion.div>

          {/* Action Recommendation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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

    </div>
  );
}
