'use client';

import { ActionCard } from "@/components/actions/ActionCard";
import { useActions } from "@/hooks/useActions";
import { motion, useReducedMotion } from 'framer-motion';
import { History } from 'lucide-react';

export default function ActionsHistoryPage() {
  const shouldReduceMotion = useReducedMotion();
  const { actionHistory, isLoading } = useActions();

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

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-slate-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : !actionHistory || actionHistory.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl border border-white/10 text-center">
          <p className="text-slate-400 text-sm">No actions yet. Start a conversation with your AI coach to receive your first weekly action.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {actionHistory.map((action) => (
            <motion.div key={action.id} variants={itemVariants}>
              <ActionCard action={action} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
