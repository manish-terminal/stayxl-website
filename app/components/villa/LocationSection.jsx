'use client';

export default function LocationSection({ locationInfo }) {
  // Handle both string and object location data
  const data = typeof locationInfo === 'object' && locationInfo !== null ? locationInfo : null;

  if (!data || typeof data === 'string') {
    return (
      <div>
        <h2 className="text-lg font-serif font-medium text-[#072720] mb-4">Location</h2>
        <p className="text-sm text-gray-400">{typeof locationInfo === 'string' ? locationInfo : 'Location details coming soon.'}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-serif font-medium text-[#072720] mb-5">Location & Getting There</h2>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearby Attractions */}
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-gray-400 font-semibold mb-3">Nearby Attractions</h3>
          <div className="space-y-2">
            {data.nearbyAttractions?.map((place, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-[#072720]/70">{place.name}</span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{place.distance}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distances & Tips */}
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-gray-400 font-semibold mb-3">How to Reach</h3>
          <div className="space-y-2 mb-5">
            {data.distances && Object.entries(data.distances).map(([key, value], i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#072720]/70">
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{value}</span>
              </div>
            ))}
          </div>

          {data.travelTips && (
            <>
              <h3 className="text-xs tracking-[0.2em] uppercase text-gray-400 font-semibold mb-3">Travel Tips</h3>
              <ul className="space-y-1.5">
                {data.travelTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                    <span className="text-[#C6A87D] mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
