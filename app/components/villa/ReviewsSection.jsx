'use client';

import { useState } from 'react';

const platformColors = {
  Google: 'bg-blue-50 text-blue-600',
  Airbnb: 'bg-rose-50 text-rose-500',
  'Booking.com': 'bg-indigo-50 text-indigo-600',
};

export default function ReviewsSection({ reviews = [], rating = 0, reviewCount = 0 }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const visibleReviews = reviews.slice(0, visibleCount);

  // Rating breakdown (simulated)
  const breakdown = [
    { label: 'Cleanliness', score: 4.9 },
    { label: 'Accuracy', score: 4.8 },
    { label: 'Location', score: 4.7 },
    { label: 'Value', score: 4.6 },
    { label: 'Communication', score: 5.0 },
    { label: 'Check-in', score: 4.9 },
  ];

  return (
    <div>
      <h2 className="text-lg font-serif font-medium text-[#072720] mb-5">
        Guest Reviews
      </h2>

      {/* Rating Summary */}
      <div className="flex items-start gap-6 md:gap-10 mb-6 pb-6 border-b border-gray-100">
        {/* Big number */}
        <div className="text-center flex-shrink-0">
          <div className="text-4xl font-serif font-light text-[#072720]">{rating}</div>
          <div className="flex items-center gap-0.5 mt-1 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-[#C6A87D]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{reviewCount} reviews</p>
        </div>

        {/* Breakdown */}
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
          {breakdown.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-24">{item.label}</span>
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#072720] rounded-full" style={{ width: `${(item.score / 5) * 100}%` }}></div>
              </div>
              <span className="text-[11px] font-medium text-[#072720] w-6 text-right">{item.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-[#EFE7E7]/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-[#C6A87D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          <span className="text-[11px] tracking-widest uppercase text-[#072720]/50 font-semibold">AI Summary</span>
        </div>
        <p className="text-sm text-[#072720]/70 leading-relaxed">
          Guests highlight the stunning valley views, well-maintained pool, and responsive caretaker. The property is praised for being true to photos. Minor mentions of steep access road.
        </p>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {visibleReviews.map((review, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[#EFE7E7] flex items-center justify-center text-xs font-semibold text-[#072720]">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#072720]">{review.name}</p>
                  <p className="text-[10px] text-gray-400">{review.date}</p>
                </div>
              </div>
              <span className={`text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-full ${platformColors[review.platform] || 'bg-gray-50 text-gray-500'}`}>
                {review.platform}
              </span>
            </div>
            <div className="flex items-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-[#C6A87D]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>

      {visibleCount < reviews.length && (
        <button
          onClick={() => setVisibleCount(reviews.length)}
          className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#072720] hover:bg-[#EFE7E7]/50 transition-colors duration-300"
        >
          Load more reviews
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
