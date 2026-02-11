'use client';

import { useState } from 'react';

export default function BookingSidebar({ pricePerNight, originalPrice }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const discount = originalPrice ? Math.round(((originalPrice - pricePerNight) / originalPrice) * 100) : 0;

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    : 1;
  const subtotal = pricePerNight * nights;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          {/* Price */}
          <div className="mb-5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-medium text-[#072720]">₹{pricePerNight.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-400">/ night</span>
            </div>
            {originalPrice && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{discount}% off</span>
              </div>
            )}
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-xl overflow-hidden mb-3">
            <div className="p-3 border-r border-gray-200">
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-sm text-[#072720] outline-none bg-transparent"
              />
            </div>
            <div className="p-3">
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-sm text-[#072720] outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="border border-gray-200 rounded-xl p-3 mb-4">
            <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Guests</label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#072720]">{guests} Guest{guests > 1 ? 's' : ''}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#072720] hover:text-[#072720] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                </button>
                <button
                  onClick={() => setGuests(Math.min(20, guests + 1))}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#072720] hover:text-[#072720] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 mb-5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>₹{pricePerNight.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Taxes & fees (18%)</span>
              <span>₹{taxes.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-medium text-[#072720]">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* CTAs */}
          <button className="w-full py-3.5 bg-[#072720] text-white text-sm font-medium rounded-xl hover:bg-[#0a3a30] transition-colors duration-300 mb-2">
            Book Now
          </button>
          <button className="w-full py-3 bg-transparent border border-gray-200 text-[#072720] text-sm font-medium rounded-xl hover:bg-[#EFE7E7] transition-colors duration-300 mb-4">
            Check Availability
          </button>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100">
            {[
              { icon: '✓', label: 'Verified Villa' },
              { icon: '🔒', label: 'Secure Pay' },
              { icon: '📞', label: '24/7 Support' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px] text-gray-400 tracking-wider">
                <span className="text-[9px]">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 z-50 lg:hidden">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-serif font-medium text-[#072720]">₹{pricePerNight.toLocaleString('en-IN')}</span>
              <span className="text-xs text-gray-400">/ night</span>
            </div>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button className="px-7 py-3 bg-[#072720] text-white text-sm font-medium rounded-xl hover:bg-[#0a3a30] transition-colors duration-300">
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
