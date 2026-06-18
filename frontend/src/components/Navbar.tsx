'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MobileMenu from './navbar/MobileMenu';

export function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Chat Coach', href: '/chat' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Action History', href: '/actions' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo (Left) */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-5.5 h-5.5 text-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-200">
              Carbon<span className="text-emerald-400">Coach</span>
            </span>
          </Link>

          {/* Navigation (Center) */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/5 border border-white/10 px-1.5 py-1 rounded-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-colors duration-200"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-navbar-nav"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/10"
                      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* CTA Button (Far Right) */}
          <div className="hidden md:flex items-center">
            <Link
              href="/chat"
              className="btn-primary inline-flex items-center justify-center text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-200 group"
              style={{ minHeight: '44px' }}
              aria-label="Calculate My Footprint button"
            >
              <span>Calculate My Footprint</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 focus:outline-none transition-all"
              aria-label="Toggle main menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileMenu 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        pathname={pathname} 
        navItems={navItems} 
      />
    </header>
  );
}
