'use client';

import { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
}

export default function AnimatedCounter({ value, suffix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return;
    }
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
