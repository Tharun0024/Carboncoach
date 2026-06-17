'use client';

import { ChatInterface } from "@/components/chat/ChatInterface";
import { ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatPage() {
  return (
    <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col px-4 py-8 md:py-12 bg-[#020617] text-slate-100">
      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Conversational Carbon Coach</span>
        </div>
        <h1 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          Chat with Carbon<span className="text-emerald-400">Coach</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
          Share your daily habits and travel details with your AI Coach. We will identify your carbon footprint hotspots together.
        </p>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-grow flex flex-col min-h-[500px]"
      >
        <ChatInterface />
      </motion.div>

      {/* Footer disclaimer */}
      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-500">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>Your chat auditing session is sandboxed and private.</span>
      </div>
    </div>
  );
}
