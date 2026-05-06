'use client';

export default function OfferTabs({ activeTab, setActiveTab }) {
  const tabs = ['All', 'Bank Offers', 'StayVista Offers'];

  return (
    <div className="mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-3 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#072720] text-white shadow-md'
                : 'bg-white text-[#072720] border border-gray-300 hover:border-[#072720] hover:shadow-sm'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
