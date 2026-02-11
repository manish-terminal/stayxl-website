'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SimilarVillasCarousel({ villas = [] }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  if (villas.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-serif font-medium text-[#072720]">Similar Villas You May Like</h2>
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
        {villas.map((villa, i) => (
          <Link
            key={i}
            href={`/villas/${villa.slug}`}
            className="flex-shrink-0 w-[260px] group"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
              <Image
                src={villa.image}
                alt={villa.name}
                fill
                sizes="260px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <h3 className="text-sm font-medium text-[#072720] mb-0.5 group-hover:text-[#C6A87D] transition-colors">{villa.name}</h3>
            <p className="text-xs text-gray-400 mb-1.5">{villa.location}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-serif font-medium text-[#072720]">₹{villa.price.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-gray-400">/ night</span>
              </div>
              <span className="text-[10px] text-gray-400">Up to {villa.guests} guests</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
