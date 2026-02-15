'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export default function BookingConfirmation({ booking, onClose }) {
  const [show, setShow] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Small delay to trigger entry animation
    setTimeout(() => {
      setShow(true);
      setTimeout(() => setAnimateIcon(true), 300);
    }, 50);
    return () => setMounted(false);
  }, []);

  if (!booking || !mounted) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />

      <div
        className={`relative bg-white w-full max-w-lg overflow-hidden transition-all duration-500 ease-out flex flex-col
          ${show ? 'translate-y-0 opacity-100' : 'translate-y-full sm:translate-y-10 opacity-0'}
          rounded-t-[32px] sm:rounded-3xl shadow-2xl max-h-[95vh]
        `}
      >
        {/* Success Header with Animated Icon */}
        <div className="bg-[#072720] px-8 py-10 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -right-10 -top-10 w-40 h-40 border border-white rounded-full" />
            <div className="absolute -left-5 -bottom-5 w-24 h-24 border border-white rounded-full" />
          </div>

          <div className={`w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 transition-all duration-700 ${animateIcon ? 'scale-100 rotate-0' : 'scale-50 rotate-12'}`}>
            <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center transition-all duration-300 shadow-xl`}>
              <svg 
                className={`w-8 h-8 text-[#072720] transition-all duration-500 ${animateIcon ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white mb-2">Booking Confirmed!</h2>
          <p className="text-white/60 text-sm font-light tracking-wide">Your luxury getaway at {booking.villa?.location || 'StayXL'} is ready.</p>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-8">
          {/* Villa Information */}
          <div className="text-center">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-2">Selected Villa</p>
            <h3 className="text-xl font-serif font-medium text-[#072720] mb-1">
              {booking.villa?.name || 'Luxury Estate'}
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>{booking.villa?.location}</span>
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-white p-5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Check-in</p>
              <p className="text-sm font-medium text-[#072720]">{formatDate(booking.checkIn)}</p>
              <p className="text-xs text-gray-400 mt-1">From 2:00 PM</p>
            </div>
            <div className="bg-white p-5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Check-out</p>
              <p className="text-sm font-medium text-[#072720]">{formatDate(booking.checkOut)}</p>
              <p className="text-xs text-gray-400 mt-1">By 11:00 AM</p>
            </div>
            <div className="bg-white p-5 col-span-2 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Primary Guest</p>
                <p className="text-sm font-medium text-[#072720]">{booking.guestName || 'Valued Guest'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Total Stay</p>
                <p className="text-sm font-medium text-[#072720]">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Selected Add-Ons */}
          {booking.addons && booking.addons.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">Experiences & Add-Ons</p>
              <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
                {booking.addons.map((addon, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 bg-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#C09A59]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#C09A59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-[#072720]">{addon.name}</span>
                    </div>
                    <span className="text-sm font-serif font-medium text-[#072720]">₹{(addon.price * (addon.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Status Card */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 ${booking.paymentMode === 'ADVANCE' ? 'bg-amber-50/50 border-amber-100' : 'bg-green-50/50 border-green-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${booking.paymentMode === 'ADVANCE' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className={`text-sm font-semibold ${booking.paymentMode === 'ADVANCE' ? 'text-amber-900' : 'text-green-900'}`}>
                  {booking.paymentMode === 'ADVANCE' ? 'Advance Payment Success' : 'Full Payment Received'}
                </span>
              </div>
              <span className={`text-base font-bold ${booking.paymentMode === 'ADVANCE' ? 'text-amber-900' : 'text-green-900'}`}>
                ₹{(booking.paymentMode === 'ADVANCE' ? booking.advanceAmount : booking.total || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {booking.paymentMode === 'ADVANCE' && (
              <div className="space-y-3 pt-3 border-t border-amber-200/50">
                <div className="flex justify-between text-xs text-amber-700">
                  <span>Booking Total</span>
                  <span className="font-semibold">₹{(booking.total || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-white/80 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="text-amber-500 animate-pulse">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-amber-800 leading-snug">
                    Remaining balance of <strong>₹{(booking.balanceAmount || 0).toLocaleString('en-IN')}</strong> is due on check-in.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Booking Info Mini-Grid */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Booking ID</span>
              <span className="text-sm font-mono text-[#072720] font-bold mt-1">#{booking.id?.slice(-8).toUpperCase()}</span>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-10 py-6 bg-gray-50/80 border-t border-gray-100 space-y-3">
          <Link
            href="/bookings"
            className="block w-full py-4 bg-[#072720] text-white text-sm font-semibold rounded-2xl hover:bg-[#0a3a30] transition-all text-center shadow-lg active:scale-[0.98]"
          >
            Manage Your Bookings
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
          >
            Go back to Villa
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
