'use client';

import { useState, useEffect } from 'react';
import { villas as staticVillas } from '../data/villas';
import VillaCard from './VillaCard';
import Link from 'next/link';

export default function RecentlyVisited() {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show top 8 villas (we currently have 5)
    setVillas(staticVillas.slice(0, 8));
    setLoading(false);
  }, []);

  const mapVilla = (villa) => {
    // Handle both old (array) and new (grouped object) amenities
    const allAmenities = Array.isArray(villa.amenities)
      ? villa.amenities
      : Object.values(villa.amenities || {}).flat();

    return {
      images: villa.images?.map(img => typeof img === 'string' ? img : img.url) || [],
      title: villa.name,
      location: villa.location,
      guests: villa.guests,
      // Handle both number (new) and potentially array (old) for bedrooms/bathrooms
      bedrooms: typeof villa.bedrooms === 'number' ? villa.bedrooms : (villa.bedrooms?.length || 0),
      bathrooms: typeof villa.bathrooms === 'number' ? villa.bathrooms : (villa.bathrooms?.length || 0),
      amenities: allAmenities.slice(0, 3),
      price: villa.pricePerNight,
      slug: villa.slug,
      tags: villa.tags || [],
    };
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-8 bg-gray-200 rounded w-56 mb-2 animate-pulse" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#072720]  mb-2">
              Our Villas
            </h2>
            <p className="text-gray-600">
              Handpicked luxury properties for your perfect getaway
            </p>
          </div>
          <Link href="/villas" className="hidden md:block text-[#072720] font-medium hover:underline transition-all">
            View All →
          </Link>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {villas.map((villa) => (
            <Link key={villa.id} href={`/villas/${villa.slug}`} className="block h-full">
              <VillaCard {...mapVilla(villa)} />
            </Link>
          ))}
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4 pb-4">
            {villas.map((villa) => (
              <div key={villa.id} className="flex-none w-[85vw] max-w-sm h-auto flex flex-col">
                <Link href={`/villas/${villa.slug}`} className="block h-full">
                  <VillaCard {...mapVilla(villa)} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-6 text-center">
          <Link href="/villas" className="text-[#072720] font-medium hover:underline transition-all">
            View All Villas →
          </Link>
        </div>
      </div>
    </section>
  );
}
