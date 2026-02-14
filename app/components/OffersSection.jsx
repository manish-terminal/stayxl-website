'use client';

import { useState, useEffect } from 'react';
import OfferTabs from './OfferTabs';
import OfferCard from './OfferCard';

export default function OffersSection() {
  const [activeTab, setActiveTab] = useState('All');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Map API response to the format OfferCard expects
          const mapped = data.data.offers.map(offer => ({
            type: offer.discountType === 'PERCENTAGE' ? 'StayXL Offer' : 'Bank Offer',
            description: offer.description || offer.title,
            code: offer.code,
            validity: new Date(offer.validTill).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            category: offer.discountType === 'PERCENTAGE' ? 'StayVista Offers' : 'Bank Offers',
          }));
          setOffers(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter offers based on active tab
  const filteredOffers = activeTab === 'All'
    ? offers
    : offers.filter(offer => offer.category === activeTab);

  if (!loading && offers.length === 0) return null;

  return (
    <section className="py-16 bg-[#EFE7E7]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#072720] font-serif mb-6">
          Offers for You
        </h2>

        {/* Filter Tabs */}
        <OfferTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Loading state */}
        {loading ? (
          <div className="flex gap-6 pb-4 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw] max-w-md">
                <div className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Offers Horizontal Scroll */}
            <div className="overflow-x-auto px-4">
              <div className="flex gap-6 pb-4">
                {filteredOffers.map((offer, index) => (
                  <div key={index} className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw] max-w-md">
                    <OfferCard offer={offer} />
                  </div>
                ))}
              </div>
            </div>

            {/* No Offers Message */}
            {filteredOffers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No offers available in this category at the moment.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
