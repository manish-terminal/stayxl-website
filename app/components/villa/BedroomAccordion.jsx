'use client';

import { useState } from 'react';

const featureIcons = {
  AC: '❄️',
  Balcony: '🌿',
  'Mountain View': '🏔️',
  'Valley View': '🏞️',
  'Walk-in Wardrobe': '👔',
  TV: '📺',
  Wardrobe: '🗄️',
  Locker: '🔒',
  'Garden Access': '🌳',
  'Rainfall Shower': '🚿',
  Bathtub: '🛁',
  default: '✓',
};

function getIcon(feature) {
  return featureIcons[feature] || featureIcons.default;
}

export default function BedroomAccordion({ bedroomDetails = [], bathroomDetails = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const allItems = [
    ...bedroomDetails.map((b) => ({ ...b, type: 'bedroom' })),
    ...bathroomDetails.map((b) => ({ ...b, type: 'bathroom' })),
  ];

  return (
    <div>
      <h2 className="text-lg font-serif font-medium text-[#072720] mb-4">
        Bedrooms & Bathrooms
      </h2>

      <div className="space-y-2">
        {allItems.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="border border-gray-100 rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-sm"
            >
              {/* Header */}
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EFE7E7] flex items-center justify-center text-sm">
                    {item.type === 'bedroom' ? '🛏️' : '🚿'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#072720]">{item.name}</p>
                    {item.type === 'bedroom' && (
                      <p className="text-[11px] text-gray-400">{item.bedType} · {item.floor}</p>
                    )}
                    {item.type === 'bathroom' && (
                      <p className="text-[11px] text-gray-400">{item.shower}</p>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 pt-0">
                  {item.type === 'bedroom' && (
                    <>
                      <p className="text-xs text-gray-400 mb-3">Size: {item.size}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.features.map((f, fi) => (
                          <span key={fi} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-[11px] text-gray-500 font-medium">
                            <span className="text-[10px]">{getIcon(f)}</span>
                            {f}
                          </span>
                        ))}
                        {item.hasBalcony && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE7E7] text-[11px] text-[#072720]/70 font-medium">
                            🌿 Balcony
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  {item.type === 'bathroom' && (
                    <div className="flex flex-wrap gap-2">
                      {item.amenities.map((a, ai) => (
                        <span key={ai} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-[11px] text-gray-500 font-medium">
                          ✓ {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
