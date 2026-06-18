'use client';

import { ActionCard } from "@/components/actions/ActionCard";
import { Action } from "@/types";
import { motion, useReducedMotion } from 'framer-motion';
import { History } from 'lucide-react';

// Mock data for demonstration
const mockActions: Action[] = [
    {
        id: 'act_01',
        title: 'Swap One Car Trip for a Walk or Bike',
        description: "Replace one short car trip (under 5km) with a walk or bike ride.",
        category: 'transport',
        impact_kgco2e_estimate: 1.05,
        difficulty: 'easy',
        status: 'completed',
    },
    {
        id: 'act_03',
        title: 'Go Meatless for One Day',
        description: "Choose one day this week to eat completely vegetarian.",
        category: 'food',
        impact_kgco2e_estimate: 2.5,
        difficulty: 'easy',
        status: 'skipped',
    }
];

export default function ActionsHistoryPage() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion ? { duration: 0 } : { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: shouldReduceMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow flex flex-col justify-start bg-[#020617] text-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
        className="mb-8 border-b border-white/10 pb-6"
      >
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <History className="w-7 h-7 text-emerald-400" />
          Your Action History
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-1">Review historical climate commitments, completed targets, and skipped weeks.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {mockActions.map((action) => (
          <motion.div key={action.id} variants={itemVariants}>
            <ActionCard action={action} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
