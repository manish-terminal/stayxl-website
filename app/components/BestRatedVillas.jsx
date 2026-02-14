'use client';

import { useState, useEffect } from 'react';
import VillaCard from './VillaCard';
import Link from 'next/link';

export default function BestRatedVillas() {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/villas?limit=4')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVillas(data.data.villas);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mapVilla = (villa) => ({
    images: villa.images?.map(img => img.url) || [],
    title: villa.name,
    location: villa.location,
    guests: villa.guests,
    bedrooms: villa.bedrooms?.length || 0,
    bathrooms: villa.bathrooms?.length || 0,
    amenities: villa.amenities?.slice(0, 3).map(a => a.name) || [],
    price: villa.pricePerNight,
    slug: villa.slug,
    rating: villa.rating,
    reviews: villa.reviewCount,
    mostInDemand: villa.isFeatured,
  });

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-5 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (villas.length === 0) return null;

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
          <Link href="/villas" className="hidden md:block text-[#072720] font-medium hover:underline transition-all">
            View All →
          </Link>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {villas.map((villa) => (
            <div key={villa.id} className="relative">
              {villa.isFeatured && (
                <div className="absolute top-4 left-4 z-10 bg-[#072720] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  🔥 Most in Demand
                </div>
              )}
              <Link href={`/villas/${villa.slug}`}>
                <VillaCard {...mapVilla(villa)} />
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4 pb-4">
            {villas.map((villa) => (
              <div key={villa.id} className="flex-none w-[85vw] max-w-sm">
                <div className="relative">
                  {villa.isFeatured && (
                    <div className="absolute top-4 left-4 z-10 bg-[#072720] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      🔥 Most in Demand
                    </div>
                  )}
                  <Link href={`/villas/${villa.slug}`}>
                    <VillaCard {...mapVilla(villa)} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-6 text-center">
          <Link href="/villas" className="text-[#072720] font-medium hover:underline transition-all">
            View All Best Rated →
          </Link>
        </div>
      </div>
    </section>
  );
}
