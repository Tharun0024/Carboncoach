'use client';

import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pathname: string;
  navItems: Array<{ name: string; href: string }>;
}

export default function MobileMenu({ isOpen, setIsOpen, pathname, navItems }: MobileMenuProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : undefined}
          className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-lg"
        >
          <div className="space-y-1.5 px-4 pb-6 pt-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-emerald-500/10 text-white border border-emerald-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/chat"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center btn-primary py-3 rounded-xl uppercase tracking-wider text-xs font-bold"
                style={{ minHeight: '44px' }}
              >
                Calculate My Footprint
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
