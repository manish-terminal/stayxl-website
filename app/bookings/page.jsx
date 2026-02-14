'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import LoginModal from '../components/LoginModal';

const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',      bg: 'bg-yellow-50',  text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-400' },
  CONFIRMED:   { label: 'Confirmed',    bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
  CHECKED_IN:  { label: 'Checked In',   bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  CHECKED_OUT: { label: 'Completed',    bg: 'bg-gray-50',    text: 'text-gray-600',   border: 'border-gray-200',   dot: 'bg-gray-400' },
  CANCELLED:   { label: 'Cancelled',    bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500' },
  REFUNDED:    { label: 'Refunded',     bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

function BookingCard({ booking }) {
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
  const villaImage = booking.villa?.images?.[0]?.url;
  const isAdvance = booking.paymentMode === 'ADVANCE';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Top section: Image + Key Info */}
      <div className="flex">
        {/* Villa Image */}
        <div className="w-36 md:w-48 relative flex-shrink-0">
          {villaImage ? (
            <img
              src={villaImage}
              alt={booking.villa?.name}
              className="w-full h-full object-cover min-h-[160px]"
            />
          ) : (
            <div className="w-full h-full min-h-[160px] bg-gradient-to-br from-[#072720] to-[#0a3a30] flex items-center justify-center">
              <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" />
              </svg>
            </div>
          )}
          {/* Status Badge overlaid on image */}
          <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide flex items-center gap-1.5 ${status.bg} ${status.text} border ${status.border} backdrop-blur-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
          <div>
            <Link
              href={`/villas/${booking.villa?.slug}`}
              className="text-base md:text-lg font-serif font-medium text-[#072720] hover:underline decoration-[#072720]/30 underline-offset-4"
            >
              {booking.villa?.name || 'Villa'}
            </Link>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {booking.villa?.location}
            </p>

            {/* Date & Guests Row */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {formatDateShort(booking.checkIn)} — {formatDateShort(booking.checkOut)}
              </div>
              <span className="text-gray-200">|</span>
              <span className="text-xs text-gray-500">{booking.nights} Night{booking.nights > 1 ? 's' : ''}</span>
              <span className="text-gray-200">|</span>
              <span className="text-xs text-gray-500">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              {isAdvance ? (
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Paid</p>
                    <p className="text-sm font-semibold text-[#072720]">₹{(booking.advanceAmount || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-amber-500 font-medium">Balance Due</p>
                    <p className="text-sm font-medium text-amber-600">₹{(booking.balanceAmount || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Total Paid</p>
                  <p className="text-sm font-semibold text-[#072720]">₹{(booking.total || 0).toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-[10px] text-gray-400">Booking ID</p>
              <p className="text-xs font-mono text-gray-500">{booking.id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advance payment banner */}
      {isAdvance && booking.status !== 'CANCELLED' && booking.status !== 'REFUNDED' && (
        <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[11px] text-amber-700">
            Balance of <strong>₹{(booking.balanceAmount || 0).toLocaleString('en-IN')}</strong> to be paid at check-in on <strong>{formatDate(booking.checkIn)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success) {
          setBookings(data.data.bookings);
        } else {
          setError(data.error || 'Failed to load bookings');
        }
      } catch {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading]);

  const filteredBookings = filter === 'ALL'
    ? bookings
    : bookings.filter((b) => {
        if (filter === 'UPCOMING') return ['PENDING', 'CONFIRMED'].includes(b.status);
        if (filter === 'ACTIVE') return b.status === 'CHECKED_IN';
        if (filter === 'PAST') return ['CHECKED_OUT', 'CANCELLED', 'REFUNDED'].includes(b.status);
        return true;
      });

  const filters = [
    { key: 'ALL', label: 'All' },
    { key: 'UPCOMING', label: 'Upcoming' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'PAST', label: 'Past' },
  ];

  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[#072720]/5 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#072720]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#072720] mb-2">Sign in to view your bookings</h1>
          <p className="text-sm text-gray-400 mb-8">Access your booking history, upcoming stays, and payment details.</p>
          <button
            onClick={() => setShowLogin(true)}
            className="px-8 py-3.5 bg-[#072720] text-white text-sm font-medium rounded-xl hover:bg-[#0a3a30] transition-colors"
          >
            Sign In
          </button>
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#072720] transition-colors mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#072720]">My Bookings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your stays and view booking details</p>

          {/* Filter Tabs */}
          {bookings.length > 0 && (
            <div className="flex gap-1 mt-6 p-1 bg-gray-100 rounded-xl w-fit">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                    filter === f.key
                      ? 'bg-white text-[#072720] shadow-sm'
                      : 'text-gray-500 hover:text-[#072720]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          // Loading skeletons
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="flex">
                  <div className="w-36 md:w-48 bg-gray-200 min-h-[160px]" />
                  <div className="flex-1 p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mt-4" />
                    <div className="h-4 bg-gray-100 rounded w-1/4 mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 text-sm font-medium text-[#072720] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-[#072720]/5 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#072720]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            {filter !== 'ALL' ? (
              <>
                <h2 className="text-xl font-serif font-medium text-[#072720] mb-2">No {filter.toLowerCase()} bookings</h2>
                <p className="text-sm text-gray-400 mb-6">Try switching to a different filter.</p>
                <button
                  onClick={() => setFilter('ALL')}
                  className="px-6 py-2.5 text-sm font-medium text-[#072720] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  View All Bookings
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-serif font-medium text-[#072720] mb-2">No bookings yet</h2>
                <p className="text-sm text-gray-400 mb-6">Discover our handpicked luxury villas and book your perfect getaway.</p>
                <Link
                  href="/villas"
                  className="inline-flex px-8 py-3.5 bg-[#072720] text-white text-sm font-medium rounded-xl hover:bg-[#0a3a30] transition-colors"
                >
                  Explore Villas
                </Link>
              </>
            )}
          </div>
        ) : (
          // Booking cards
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
