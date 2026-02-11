'use client';

import { useRef } from 'react';
import Image from 'next/image';

export default function SpacesSlider({ spaces = [] }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  if (spaces.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-medium text-[#072720]">Spaces</h2>
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
        {spaces.map((space, i) => (
          <div key={i} className="flex-shrink-0 w-[260px] group cursor-pointer" style={{ scrollSnapAlign: 'start' }}>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
              <Image
                src={space.image}
                alt={space.name}
                fill
                sizes="260px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <h3 className="text-sm font-medium text-[#072720] mb-1">{space.name}</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">{space.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {space.features.map((f, fi) => (
                <span key={fi} className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] text-gray-500 font-medium">{f}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
