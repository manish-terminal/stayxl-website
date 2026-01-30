'use client';

import { useState } from 'react';
import OfferTabs from './OfferTabs';
import OfferCard from './OfferCard';

export default function OffersSection() {
  const [activeTab, setActiveTab] = useState('All');

  // Dummy offers data
  const offers = [
    {
      type: 'Bank Offer',
      description: 'Get 11% off (up to ₹3,000) on your StayVista booking when you pay with an HSBC TravelOne Credit Card.',
      code: 'HSBCTRAVEL',
      validity: '31 Dec 2026',
      category: 'Bank Offers',
    },
    {
      type: 'Bank Offer',
      description: 'Enjoy 15% instant discount (up to ₹5,000) on bookings using HDFC Bank Credit Cards.',
      code: 'HDFCVILLA',
      validity: '30 Nov 2026',
      category: 'Bank Offers',
    },
    {
      type: 'StayVista Offer',
      description: 'Book 3 nights or more and get 20% off on your entire stay. Perfect for extended vacations!',
      code: 'STAY3NIGHTS',
      validity: '15 Jan 2027',
      category: 'StayVista Offers',
    },
    {
      type: 'StayVista Offer',
      description: 'First-time booking? Get ₹2,500 off on bookings above ₹15,000. Welcome to luxury!',
      code: 'WELCOME2500',
      validity: '31 Mar 2027',
      category: 'StayVista Offers',
    },
    {
      type: 'Bank Offer',
      description: 'Get 10% cashback (up to ₹2,000) when you pay using ICICI Bank Debit or Credit Cards.',
      code: 'ICICIVILLA',
      validity: '28 Feb 2027',
      category: 'Bank Offers',
    },
    {
      type: 'StayVista Offer',
      description: 'Early bird special! Book 30 days in advance and save 25% on premium villas.',
      code: 'EARLYBIRD25',
      validity: '31 Dec 2026',
      category: 'StayVista Offers',
    },
  ];

  // Filter offers based on active tab
  const filteredOffers = activeTab === 'All' 
    ? offers 
    : offers.filter(offer => offer.category === activeTab);

  return (
    <section className="py-16 bg-[#EFE7E7]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#072720] font-serif mb-6">
          Offers for You
        </h2>

        {/* Filter Tabs */}
        <OfferTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Offers Horizontal Scroll */}
        <div className="overflow-x-auto   px-4">
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
      </div>
    </section>
  );
}
