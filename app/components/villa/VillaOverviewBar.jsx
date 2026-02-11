'use client';

export default function VillaOverviewBar({ guests, bedrooms, bathrooms, area, highlights = [] }) {
  const items = [
    {
      label: 'Guests',
      value: guests,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: 'Bedrooms',
      value: bedrooms,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0l8.955 8.955M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
        </svg>
      ),
    },
    {
      label: 'Bathrooms',
      value: bathrooms,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
    {
      label: 'Area',
      value: area,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      ),
    },
  ];

  return (
    <div className="border-y border-gray-100 py-5">
      <div className="flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-hide">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#EFE7E7] flex items-center justify-center text-[#072720]/60">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-[#072720]">{item.value}</p>
              <p className="text-[11px] text-gray-400 tracking-wide">{item.label}</p>
            </div>
          </div>
        ))}

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 flex-shrink-0 hidden md:block"></div>

        {/* Key features */}
        {highlights.slice(0, 4).map((tag, i) => (
          <span key={i} className="hidden md:inline-flex items-center gap-1.5 flex-shrink-0 text-[11px] tracking-wider text-[#072720]/50 font-medium">
            <svg className="w-3 h-3 text-[#C6A87D]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
