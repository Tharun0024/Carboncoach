'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { SendHorizontal, Loader2 } from 'lucide-react';

export function ChatInterface() {
  const { messages, sendMessage, isStreaming } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
      {/* Messages Feed */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation with CarbonCoach"
        className="flex-grow p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-slate-950/20"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              💬
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Begin Your Environmental Audit</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Type a greeting or tell the coach about your weekly car commutes, dietary choices, or electricity usage.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        
        {isStreaming && messages[messages.length - 1]?.role === 'assistant' && (
          <div className="flex items-center space-x-2 text-slate-450 text-xs font-bold animate-pulse pl-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>CarbonCoach is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/40 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isStreaming}
            className="flex-grow bg-slate-950/80 text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{ minHeight: '44px' }}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="flex items-center justify-center btn-primary text-slate-950 font-bold px-5 py-3 rounded-xl transition-all duration-200 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-transparent disabled:cursor-not-allowed shadow-sm"
            style={{ minHeight: '44px' }}
            aria-label="Send message"
          >
            <span className="hidden sm:inline mr-1.5 text-xs font-bold uppercase tracking-widest">Send</span>
            <SendHorizontal className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
