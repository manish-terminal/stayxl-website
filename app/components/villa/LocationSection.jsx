'use client';

import { useState } from 'react';

const TABS = [
  { id: 'attractions', label: 'Nearby Attractions' },
  { id: 'reach', label: 'How to Reach' },
  { id: 'tips', label: 'Travel Tips' },
];

export default function LocationSection({ locationInfo }) {
  const [activeTab, setActiveTab] = useState('attractions');

  const data = typeof locationInfo === 'object' && locationInfo !== null ? locationInfo : null;

  if (!data || typeof data === 'string') {
    return (
      <div>
        <h2 className="text-lg  font-medium text-[#072720] mb-4">Location</h2>
        <p className="text-sm text-gray-400">{typeof locationInfo === 'string' ? locationInfo : 'Location details coming soon.'}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg  font-medium text-[#072720] mb-5">Location & Getting There</h2>

      {/* Map Placeholder */}
      <div className="relative w-full h-52 md:h-64 rounded-xl overflow-hidden bg-gray-100 mb-6">
        <div className="absolute inset-0 flex items-center justify-center bg-[#EFE7E7]/50">
          <div className="text-center">
            <svg className="w-8 h-8 text-[#072720]/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="text-xs text-gray-400">{data.address}</p>
            <a
              href={data.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-[#072720] hover:text-[#C6A87D] transition-colors"
            >
              Open in Google Maps
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* 3 Tabs */}
      <div className="flex gap-1 bg-gray-50 rounded-lg p-1 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-xs font-medium py-2 px-3 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-[#072720] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[180px]">

        {/* Nearby Attractions */}
        {activeTab === 'attractions' && (
          <div className="space-y-1">
            {data.nearbyAttractions?.map((place, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-[#072720]/70">{place.name}</span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full flex-shrink-0 ml-3">{place.distance}</span>
              </div>
            ))}
          </div>
        )}

        {/* How to Reach */}
        {activeTab === 'reach' && (
          <div className="space-y-3">
            {data.distances && Object.entries(data.distances).map(([key, value], i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  {key === 'airport' ? (
                    <svg className="w-4 h-4 text-[#C6A87D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-[#C6A87D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[#072720]/70">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Travel Tips */}
        {activeTab === 'tips' && data.travelTips && (
          <ul className="space-y-2.5">
            {data.travelTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#072720]/60 leading-relaxed">
                <span className="text-[#C6A87D] mt-0.5 flex-shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
