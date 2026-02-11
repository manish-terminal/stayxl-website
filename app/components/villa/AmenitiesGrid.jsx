'use client';

import { useState } from 'react';

const categoryLabels = {
  popular: 'Popular Features',
  kitchen: 'Kitchen',
  outdoor: 'Outdoor',
  entertainment: 'Entertainment',
  safety: 'Safety',
};

const amenityIcons = {
  'Private Pool': '🏊',
  'Mountain View': '🏔️',
  'Fireplace': '🔥',
  'BBQ Area': '🍖',
  'Bonfire Pit': '🔥',
  'Indoor Games': '🎮',
  'Parking': '🅿️',
  'Modular Kitchen': '🍳',
  'Refrigerator': '🧊',
  'Microwave': '📻',
  'Electric Kettle': '☕',
  'Coffee Maker': '☕',
  'Crockery Set': '🍽️',
  'Water Purifier': '💧',
  'Garden': '🌿',
  'Sit-out Area': '🪑',
  'Infinity Pool': '🏊',
  'Deck': '🪵',
  'Sun Loungers': '🛋️',
  'Swing': '🎠',
  'Smart TV': '📺',
  'Bluetooth Speaker': '🔊',
  'Board Games': '🎲',
  'Books Library': '📚',
  'Card Games': '🃏',
  'CCTV': '📷',
  'Fire Extinguisher': '🧯',
  'First Aid Kit': '🩹',
  'Caretaker on Site': '👨‍💼',
  'Gated Property': '🔐',
};

export default function AmenitiesGrid({ amenities = {} }) {
  const [showAll, setShowAll] = useState(false);
  const categories = Object.entries(amenities);
  const initialShow = showAll ? categories : categories.slice(0, 2);

  return (
    <div>
      <h2 className="text-lg font-serif font-medium text-[#072720] mb-5">
        Amenities
      </h2>

      <div className="space-y-6">
        {initialShow.map(([key, items]) => (
          <div key={key}>
            <h3 className="text-xs tracking-[0.2em] uppercase text-gray-400 font-semibold mb-3">
              {categoryLabels[key] || key}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50/80 hover:bg-[#EFE7E7]/50 transition-colors duration-200">
                  <span className="text-sm">{amenityIcons[item] || '✓'}</span>
                  <span className="text-[13px] text-[#072720]/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {categories.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-5 inline-flex items-center gap-1 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#072720] hover:bg-[#EFE7E7]/50 transition-colors duration-300"
        >
          {showAll ? 'Show less' : `View all ${Object.values(amenities).flat().length} amenities`}
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
