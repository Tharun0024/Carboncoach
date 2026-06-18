'use client';

import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import WhySection from '@/components/landing/WhySection';
import JourneySection from '@/components/landing/JourneySection';
import CoachingSection from '@/components/landing/CoachingSection';

export default function LandingPage() {
  return (
    <div className="w-full flex-grow flex flex-col justify-start overflow-x-hidden bg-[#020617] text-slate-100 relative">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none -z-10" />

      {/* Landing page sections */}
      <HeroSection />
      <StatsSection />
      <WhySection />
      <JourneySection />
      <CoachingSection />

    </div>
  );
}
