'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ExperiencesSlider({ experiences = [] }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  if (experiences.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-serif font-medium text-[#072720]">Experiences & Add-Ons</h2>
          <p className="text-xs text-gray-400 mt-0.5">Enhance your stay with curated services</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#072720] hover:text-[#072720] transition-colors" aria-label="Previous">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#072720] hover:text-[#072720] transition-colors" aria-label="Next">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-1" style={{ scrollSnapType: 'x mandatory' }}>
        {experiences.map((exp, i) => (
          <div key={i} className="flex-shrink-0 w-[240px] group flex flex-col" style={{ scrollSnapAlign: 'start' }} >
            {/* Clickable Card Header & Image */}
            <div className="relative mb-3 flex-shrink-0 transition-all duration-300 group-hover:-translate-y-1">
              {exp.slug ? (
                <Link href={`/experiences/${exp.slug}`} className="block">
                  <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={exp.image}
                    alt={exp.name}
                    fill
                    sizes="240px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] uppercase tracking-widest font-semibold border border-white/40 px-3 py-1.5 rounded-full backdrop-blur-sm">Explore Experience</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={exp.image}
                  alt={exp.name}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="text-sm font-medium text-[#072720]">{exp.name}</h3>
              {exp.slug && (
                <Link 
                  href={`/experiences/${exp.slug}`} 
                  className="text-[10px] text-[#C09A59] border-b border-[#C09A59]/0 hover:border-[#C09A59]/50 transition-all uppercase tracking-wider font-semibold"
                >
                  Explore
                </Link>
              )}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed mb-2 line-clamp-2">{exp.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-serif font-medium text-[#072720]">₹{exp.price.toLocaleString('en-IN')}</span>
              <button className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-[#072720]/15 text-[#072720] hover:bg-[#072720] hover:text-white transition-all duration-300">
                Add to Stay
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
