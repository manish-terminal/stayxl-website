'use client';

import { useRef, useState } from 'react';

export default function OffersCarousel({ offers = [], onApply }) {
  const scrollRef = useRef(null);
  const [appliedCode, setAppliedCode] = useState(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  const handleApply = (code) => {
    if (onApply) onApply(code);
    setAppliedCode(code);
    setTimeout(() => setAppliedCode(null), 2000);
  };

  if (offers.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-medium text-[#072720]">Offers & Deals</h2>
        <div className="flex gap-1.5">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#072720] hover:text-[#072720] transition-colors" aria-label="Previous">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#072720] hover:text-[#072720] transition-colors" aria-label="Next">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-1" style={{ scrollSnapType: 'x mandatory' }}>
        {offers.map((offer, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[280px] border border-dashed border-[#072720]/15 rounded-xl p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 bg-white"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Code Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EFE7E7] mb-3">
              <svg className="w-3 h-3 text-[#072720]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <span className="text-[10px] font-bold tracking-widest text-[#072720]">{offer.code}</span>
            </div>

            <h3 className="text-sm font-semibold text-[#072720] mb-1">{offer.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">{offer.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 tracking-wider">Valid till {offer.validTill}</span>
              <button
                onClick={() => handleApply(offer.code)}
                className={`text-[11px] font-medium transition-colors ${
                  appliedCode === offer.code
                    ? 'text-green-600'
                    : 'text-[#072720] hover:text-[#C6A87D]'
                }`}
              >
                {appliedCode === offer.code ? 'Applied ✓' : 'Apply →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
