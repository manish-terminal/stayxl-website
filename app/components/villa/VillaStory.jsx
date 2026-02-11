'use client';

import { useState } from 'react';

export default function VillaStory({ story = '', name = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const paragraphs = story.split('\n\n').filter(Boolean);
  const showToggle = paragraphs.length > 2;
  const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 2);

  return (
    <div>
      <h2 className="text-lg font-serif font-medium text-[#072720] mb-4">
        About {name}
      </h2>

      <div className="columns-1 md:columns-2 gap-8">
        {visibleParagraphs.map((para, i) => (
          <p
            key={i}
            className="text-sm text-gray-500 leading-relaxed mb-4 break-inside-avoid"
          >
            {para}
          </p>
        ))}
      </div>

      {showToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#072720] hover:text-[#C6A87D] transition-colors duration-300 mt-1"
        >
          {isExpanded ? 'Show less' : 'Read more'}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
