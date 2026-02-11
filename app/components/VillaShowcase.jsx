'use client';

import Link from 'next/link';

export default function VillaShowcase() {
  return (
    <section className="bg-[#0a0a0a] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c9a96e]/20 bg-[#c9a96e]/5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-pulse"></div>
              <span className="text-[#c9a96e] text-[10px] tracking-[0.25em] uppercase font-medium">StayXL Privé</span>
            </div>

            {/* Tagline */}
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-serif font-light text-white tracking-wide leading-snug">
              Where exclusivity meets
              <br className="hidden md:block" />
              <span className="text-white/35"> timeless luxury</span>
              <span className="text-[#c9a96e]"> in every stay.</span>
            </h2>
          </div>

          {/* Explore CTA */}
          <Link
            href="/prive"
            className="flex items-center gap-2 px-7 py-2.5 rounded-full border border-[#c9a96e]/30 text-[#c9a96e] text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#c9a96e]/10 hover:border-[#c9a96e]/50 transition-all duration-300"
          >
            Explore Privé
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
