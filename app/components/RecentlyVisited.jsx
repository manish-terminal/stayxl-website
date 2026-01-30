'use client';

import VillaCard from './VillaCard';

export default function RecentlyVisited() {
  // Dummy recently visited villas data
  const recentlyVisitedVillas = [
    {
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      ],
      title: 'Lafu House Hearth | Serene Hills',
      location: 'Lafugathi, Shimla',
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 4468,
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
    },
    {
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      ],
      title: 'Riverside Paradise | Peaceful Escape',
      location: 'Rishikesh, Uttarakhand',
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 3200,
    },
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
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#072720] font-serif mb-2">
              Recently Visited
            </h2>
            <p className="text-gray-600">
              Properties you've recently explored
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
            {recentlyVisitedVillas.map((villa, index) => (
              <VillaCard key={index} {...villa} />
            ))}
          </div>

          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-4 pb-4">
              {recentlyVisitedVillas.map((villa, index) => (
                <div key={index} className="flex-none w-[85vw] max-w-sm">
                  <VillaCard {...villa} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-6 text-center">
          <button className="text-[#072720] font-medium hover:underline transition-all">
            View All Recently Visited →
          </button>
        </div>
      </div>
    </section>
  );
}
