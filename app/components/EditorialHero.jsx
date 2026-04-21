'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function EditorialHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image - High Impact Visual */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
          alt="Luxury Villa"
          fill
          priority
          className="object-cover brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Handpicked Excellence
          </p>
          <h1 className="heading-editorial mb-8 text-5xl md:text-7xl lg:text-8xl">
            The Standard of <br /> Exceptional Stays
          </h1>
          
          {/* Minimalist Search Overlay (Airbnb Style) */}
          <div className="mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-full bg-white p-2 shadow-airbnb md:flex md:items-center">
            <div className="flex-1 px-8 py-3 text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/40">Location</label>
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-foreground/30"
              />
            </div>
            <div className="hidden h-8 w-px bg-gray-200 md:block" />
            <div className="flex-1 px-8 py-3 text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/40">Dates</label>
              <p className="text-sm font-medium text-foreground/30">Add dates</p>
            </div>
            <div className="hidden h-8 w-px bg-gray-200 md:block" />
            <div className="flex-1 px-8 py-3 text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/40">Guests</label>
              <p className="text-sm font-medium text-foreground/30">Add guests</p>
            </div>
            <button className="flex h-12 w-full items-center justify-center rounded-full bg-accent-alt px-8 transition-all hover:brightness-110 md:w-auto">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Badge (Plum Guide Style) */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">Vetted by Critics</span>
        </div>
      </div>
    </section>
  );
}
