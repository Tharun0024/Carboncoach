'use client';

import { Message } from '@/types';
import { StreamingText } from './StreamingText';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const shouldReduceMotion = useReducedMotion();
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      role="listitem"
      className={`flex items-start gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5 shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl border text-sm sm:text-base leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-slate-950 font-semibold border-emerald-400/20 shadow-sm rounded-tr-none'
            : 'glass-card text-slate-100 border-white/10 shadow-sm rounded-tl-none'
        }`}
      >
        {message.isStreaming ? (
          <StreamingText text={message.content} />
        ) : (
          <p className="whitespace-pre-line">{message.content}</p>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 mt-0.5 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
}
