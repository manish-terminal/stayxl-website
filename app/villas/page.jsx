'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VillaCard from '../components/VillaCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

import { villas as staticVillas } from '../data/villas';

function VillasList() {
  const searchParams = useSearchParams();
  const [villas, setVillas] = useState(staticVillas);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minGuests: searchParams.get('minGuests') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const applyLocalFilters = () => {
    let filtered = staticVillas;
    if (filters.location) {
      filtered = filtered.filter(v => v.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.minGuests) {
      filtered = filtered.filter(v => v.guests >= parseInt(filters.minGuests));
    }
    if (filters.minPrice) {
      filtered = filtered.filter(v => v.pricePerNight >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(v => v.pricePerNight <= parseInt(filters.maxPrice));
    }
    setVillas(filtered);
  };

  useEffect(() => {
    applyLocalFilters();
  }, [filters, searchParams]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    window.history.pushState({}, '', `/villas?${params.toString()}`);
    applyLocalFilters();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters Sidebar/Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1">
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Location</label>
          <input 
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Search location..."
            className="w-full text-sm outline-none border-b border-gray-100 pb-2 focus:border-[#072720] transition-colors"
          />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Guests</label>
          <select 
            name="minGuests"
            value={filters.minGuests}
            onChange={handleFilterChange}
            className="w-full text-sm outline-none border-b border-gray-100 pb-2 focus:border-[#072720] cursor-pointer"
          >
            <option value="">Any</option>
            {[1,2,3,4,5,6,8,10,12].map(n => <option key={n} value={n}>{n}+ Guests</option>)}
          </select>
        </div>
        <div className="w-full md:w-48">
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Price Range</label>
          <div className="flex items-center gap-2">
            <input 
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min"
              type="number"
              className="w-full text-sm outline-none border-b border-gray-100 pb-2 focus:border-[#072720]"
            />
            <span className="text-gray-300">-</span>
            <input 
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max"
              type="number"
              className="w-full text-sm outline-none border-b border-gray-100 pb-2 focus:border-[#072720]"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button 
            onClick={applyFilters}
            className="w-full md:w-auto px-8 py-2.5 bg-[#072720] text-white text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-[#0a3a30] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[4/5] bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : villas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 mb-4">No villas found matching your criteria.</p>
          <button 
            onClick={() => {
              setFilters({location: '', minGuests: '', minPrice: '', maxPrice: ''});
              window.history.pushState({}, '', '/villas');
            }}
            className="text-[#072720] font-semibold text-sm hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {villas.map((villa) => (
            <Link key={villa.id} href={`/villas/${villa.slug}`}>
              <VillaCard 
                images={villa.images?.map(img => img.url) || []}
                title={villa.name}
                location={villa.location}
                guests={villa.guests}
                bedrooms={villa.bedrooms?.length || 0}
                bathrooms={villa.bathrooms?.length || 0}
                amenities={villa.amenities?.map(a => a.name) || []}
                price={villa.pricePerNight}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VillasPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      <div className="bg-[#072720] text-white py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Explore Our Collection</h1>
        <p className="text-white/60 font-light tracking-widest uppercase text-sm">Handpicked Luxury Stays</p>
      </div>
      
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <VillasList />
      </Suspense>

      <Footer />
    </main>
  );
}
