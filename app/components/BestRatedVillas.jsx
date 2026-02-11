'use client';

import VillaCard from './VillaCard';

export default function BestRatedVillas() {
  // Dummy best rated villas data with ratings
  const bestRatedVillas = [
    {
      images: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80',
      ],
      title: 'Heritage Villa | Colonial Charm',
      location: 'Goa',
      guests: 10,
      bedrooms: 5,
      bathrooms: 4,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 8999,
      rating: 4.9,
      reviews: 127,
      mostInDemand: true,
    },
    {
      images: [
        'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
      ],
      title: 'Beachfront Bliss | Ocean Views',
      location: 'Alibaug, Maharashtra',
      guests: 6,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 5500,
      rating: 4.8,
      reviews: 94,
      mostInDemand: true,
    },
    {
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      ],
      title: 'Mountain View Villa | Luxury Retreat',
      location: 'Manali, Himachal Pradesh',
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 6850,
      rating: 4.9,
      reviews: 156,
      mostInDemand: false,
    },
    {
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      ],
      title: 'Forest Hideaway | Nature Retreat',
      location: 'Coorg, Karnataka',
      guests: 5,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 3800,
      rating: 4.7,
      reviews: 82,
      mostInDemand: false,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#072720] font-serif mb-2">
              Best Rated Villas
            </h2>
            <p className="text-gray-600">
              Top-rated properties loved by our guests
            </p>
          </div>
          <button className="hidden md:block text-[#072720] font-medium hover:underline transition-all">
            View All →
          </button>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="relative">
          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestRatedVillas.map((villa, index) => (
              <div key={index} className="relative">
                {/* Most in Demand Badge */}
                {villa.mostInDemand && (
                  <div className="absolute top-4 left-4 z-10 bg-[#072720] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                    🔥 Most in Demand
                  </div>
                )}
                <VillaCard {...villa} />
              </div>
            ))}
          </div>

          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-4 pb-4">
              {bestRatedVillas.map((villa, index) => (
                <div key={index} className="flex-none w-[85vw] max-w-sm">
                  <div className="relative">
                    {/* Most in Demand Badge */}
                    {villa.mostInDemand && (
                      <div className="absolute top-4 left-4 z-10 bg-[#072720] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                        🔥 Most in Demand
                      </div>
                    )}
                    <VillaCard {...villa} />

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-6 text-center">
          <button className="text-[#072720] font-medium hover:underline transition-all">
            View All Best Rated →
          </button>
        </div>
      </div>
    </section>
  );
}
