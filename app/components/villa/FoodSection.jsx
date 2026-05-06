'use client';

import Image from 'next/image';

export default function FoodSection({ mealsData }) {
  if (!mealsData) return null;

  return (
    <div>
      <h2 className="text-lg  font-medium text-[#072720] mb-5">Meals</h2>

      {/* Banner */}
      {mealsData.bannerImage && (
        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6 group cursor-pointer">
          <Image
            src={mealsData.bannerImage}
            alt="Meals at the villa"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-[#072720] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Meal Notes */}
      {mealsData.notes && mealsData.notes.length > 0 && (
        <div className="bg-[#FDFBF7] border border-[#E8DFD0] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-[#C6A87D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className="text-xs tracking-[0.15em] uppercase text-[#072720]/50 font-semibold">Important Notes</span>
          </div>
          <ul className="space-y-2">
            {mealsData.notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#072720]/70 leading-relaxed">
                <span className="text-[#C6A87D] mt-0.5 flex-shrink-0">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
