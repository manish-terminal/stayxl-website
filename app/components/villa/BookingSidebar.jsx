'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../LoginModal';
import BookingConfirmation from '../BookingConfirmation';
import DatePicker from './DatePicker';

export default function BookingSidebar({ villaId, villaSlug, pricePerNight, originalPrice, maxGuests, selectedAddons = [], experiences = [], onToggleAddon, applyCouponCode }) {
  const [showAddons, setShowAddons] = useState(false);
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMode, setPaymentMode] = useState('FULL'); // FULL | ADVANCE

  const [bookingState, setBookingState] = useState('idle'); // idle | checking | unavailable | available | creating | paying | confirmed
  const [availabilityData, setAvailabilityData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState(new Set());
  const [showCalendar, setShowCalendar] = useState(false);

  const discount = originalPrice ? Math.round(((originalPrice - pricePerNight) / originalPrice) * 100) : 0;

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    : 1;
  const subtotal = pricePerNight * nights;
  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price * a.quantity, 0);
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const taxes = Math.round((subtotal + addonTotal - couponDiscount) * 0.18);
  const total = subtotal + addonTotal - couponDiscount + taxes;
  const advanceAmount = Math.round(total * 0.30);
  const balanceAmount = total - advanceAmount;
  const payNow = paymentMode === 'ADVANCE' ? advanceAmount : total;

  useEffect(() => {
    if (user) {
      setGuestName(user.name || '');
      setGuestPhone(user.phone || '');
    }
  }, [user]);

  // Minimum check-in date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Min check-out is day after check-in
  const minCheckout = checkIn
    ? (() => { const d = new Date(checkIn); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()
    : minDate;

  // ─── Check Availability ───
  const checkAvailability = useCallback(async () => {
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }
    setError('');
    setBookingState('checking');

    try {
      const res = await fetch(
        `/api/villas/${villaSlug}/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
      );
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to check availability');
        setBookingState('idle');
        return;
      }

      if (data.data.available) {
        setAvailabilityData(data.data);
        setBookingState('available');
      } else {
        setError('This villa is not available for the selected dates. Please try different dates.');
        setBookingState('unavailable');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setBookingState('idle');
    }
  }, [checkIn, checkOut, guests, villaSlug]);

  // ─── Fetch Unavailable Dates ───
  useEffect(() => {
    if (!villaSlug) return;
    const fetchUnavailable = async () => {
      try {
        const from = new Date();
        const to = new Date();
        to.setMonth(to.getMonth() + 6);
        const res = await fetch(
          `/api/villas/${villaSlug}/unavailable-dates?from=${from.toISOString().split('T')[0]}&to=${to.toISOString().split('T')[0]}`
        );
        const data = await res.json();
        if (data.success && data.data.unavailableDates) {
          setUnavailableDates(new Set(data.data.unavailableDates));
        }
      } catch {
        // Silently fail — calendar still works without blackout data
      }
    };
    fetchUnavailable();
  }, [villaSlug]);

  // ─── Auto-Check Availability When Both Dates Selected ───
  useEffect(() => {
    if (checkIn && checkOut && bookingState === 'idle') {
      checkAvailability();
    }
  }, [checkIn, checkOut]);

  // ─── Auto-Apply Coupon From Offers Section ───
  useEffect(() => {
    if (applyCouponCode && applyCouponCode !== couponCode) {
      setCouponCode(applyCouponCode);
      // Auto-validate after a brief tick so state is updated
      setTimeout(async () => {
        try {
          const res = await fetch('/api/offers/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: applyCouponCode.toUpperCase(), bookingAmount: subtotal }),
          });
          const data = await res.json();
          if (data.success) {
            setAppliedCoupon(data.data);
            setError('');
          } else {
            setError(data.error);
            setAppliedCoupon(null);
          }
        } catch {
          setError('Failed to validate coupon');
        }
      }, 100);
    }
  }, [applyCouponCode]);

  // ─── Validate Coupon ───
  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setError('');

    try {
      const res = await fetch('/api/offers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.toUpperCase(), bookingAmount: subtotal }),
      });
      const data = await res.json();

      if (data.success) {
        setAppliedCoupon(data.data);
      } else {
        setError(data.error);
        setAppliedCoupon(null);
      }
    } catch {
      setError('Failed to validate coupon');
    }
  };

  // ─── Load Razorpay Script ───
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ─── Book Now ───
  const handleBookNow = async () => {
    if (isLoading) return;

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (!guestName.trim()) {
      setError('Please enter the guest name');
      return;
    }

    if (!guestPhone.trim() || !/^[6-9]\d{9}$/.test(guestPhone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setBookingState('creating');

    try {
      // 1. Create booking
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villaId: villaId || villaSlug,
          checkIn,
          checkOut,
          guests,
          guestName: guestName.trim(),
          guestPhone: guestPhone.trim(),
          paymentMode,
          couponCode: appliedCoupon?.code,
          specialRequests: specialRequests || undefined,
          addons: selectedAddons.length > 0 ? selectedAddons : undefined,
        }),
      });
      const bookingData = await bookingRes.json();

      if (!bookingData.success) {
        setError(bookingData.error || 'Failed to create booking');
        setBookingState('available');
        return;
      }

      const booking = bookingData.data;

      // 2. Create Razorpay order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setError(orderData.error || 'Failed to initiate payment');
        setBookingState('available');
        return;
      }

      // 3. Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError('Failed to load payment gateway. Please try again.');
        setBookingState('available');
        return;
      }

      setBookingState('paying');

      // 4. Open Razorpay Checkout
      const options = {
        key: orderData.data.keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'StayXL',
        description: 'Villa Booking Payment',
        order_id: orderData.data.orderId,
        prefill: {
          name: user.name || '',
          contact: user.phone || '',
          email: user.email || '',
        },
        theme: {
          color: '#072720',
          backdrop_color: 'rgba(0, 0, 0, 0.6)',
        },
        modal: {
          ondismiss: () => {
            setBookingState('available');
          },
        },
        handler: async (response) => {
          // 5. Verify payment
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setConfirmedBooking(verifyData.data.booking);
              setBookingState('confirmed');
            } else {
              setError('Payment verification failed. Contact support if amount was deducted.');
              setBookingState('available');
            }
          } catch {
            setError('Payment verification failed. Contact support if amount was deducted.');
            setBookingState('available');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setBookingState('available');
      });
      rzp.open();
    } catch {
      setError('Something went wrong. Please try again.');
      setBookingState('available');
    }
  };

  const isLoading = ['checking', 'creating', 'paying', 'creating_order'].includes(bookingState);

  const getButtonText = () => {
    switch (bookingState) {
      case 'checking': return 'Checking...';
      case 'creating': return 'Creating booking...';
      case 'paying': return 'Completing payment...';
      default: return 'Confirm Booking';
    }
  };

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
          <div className="mb-3">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full grid grid-cols-2 gap-0 border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
            >
              <div className="p-3 border-r border-gray-200 text-left">
                <span className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Check-in</span>
                <span className={`text-sm font-medium ${checkIn ? 'text-[#072720]' : 'text-gray-300'}`}>
                  {checkIn ? new Date(checkIn + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
                </span>
              </div>
              <div className="p-3 text-left">
                <span className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Check-out</span>
                <span className={`text-sm font-medium ${checkOut ? 'text-[#072720]' : 'text-gray-300'}`}>
                  {checkOut ? new Date(checkOut + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
                </span>
              </div>
            </button>
            {showCalendar && (
              <div className="mt-2 p-4 border border-gray-200 rounded-xl bg-white shadow-lg">
                <DatePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={(v) => { setCheckIn(v); setBookingState('idle'); setAvailabilityData(null); }}
                  onCheckOutChange={(v) => { setCheckOut(v); if (v) setShowCalendar(false); setBookingState('idle'); setAvailabilityData(null); }}
                  unavailableDates={unavailableDates}
                  minDate={minDate}
                />
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
            <div className="p-3">
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Guest Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Full name of primary guest"
                className="w-full text-sm text-[#072720] outline-none bg-transparent placeholder:text-gray-300"
              />
            </div>
          </div>

          {!user && (
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
              <div className="p-3">
                <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Phone Number</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 font-medium">+91</span>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    className="w-full text-sm text-[#072720] outline-none bg-transparent placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

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
                  onClick={() => setGuests(Math.min(maxGuests || 20, guests + 1))}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#072720] hover:text-[#072720] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="flex">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setAppliedCoupon(null);
                }}
                placeholder="Have a coupon?"
                className="flex-1 px-3 py-2.5 text-sm text-[#072720] outline-none placeholder:text-gray-300"
              />
              <button
                onClick={validateCoupon}
                disabled={!couponCode.trim()}
                className="px-4 text-xs font-semibold text-[#072720] hover:bg-gray-50 transition-colors disabled:text-gray-300 border-l border-gray-200"
              >
                {appliedCoupon ? '✓ Applied' : 'Apply'}
              </button>
            </div>
            {appliedCoupon && (
              <div className="px-3 py-2 bg-green-50 border-t border-green-100 flex items-center justify-between">
                <span className="text-xs text-green-700">{appliedCoupon.title}</span>
                <span className="text-xs font-medium text-green-700">−₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          {/* Available Coupons */}
          {!appliedCoupon && (
            <div className="mb-4">
              <button
                onClick={() => {
                  setShowCoupons(!showCoupons);
                  if (availableCoupons.length === 0) {
                    fetch('/api/offers')
                      .then(res => res.json())
                      .then(data => {
                        if (data.success) setAvailableCoupons(data.data.offers);
                      })
                      .catch(() => {});
                  }
                }}
                className="w-full text-left text-xs text-[#072720] hover:text-[#0a3a30] flex items-center gap-1.5 transition-colors font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                {showCoupons ? 'Hide coupons' : 'View available coupons'}
                <svg className={`w-3 h-3 ml-auto transition-transform ${showCoupons ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {showCoupons && (
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {availableCoupons.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2">Loading coupons...</p>
                  ) : (
                    availableCoupons.map((offer) => (
                      <button
                        key={offer.code}
                        onClick={() => {
                          setCouponCode(offer.code);
                          setShowCoupons(false);
                        }}
                        className="w-full text-left border border-dashed border-gray-200 rounded-lg p-2.5 hover:border-[#072720] hover:bg-[#072720]/[0.02] transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold tracking-wider text-[#072720] font-mono">{offer.code}</span>
                          <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{offer.title}</p>
                        {offer.minBookingAmount && (
                          <p className="text-[10px] text-gray-300 mt-0.5">Min. booking ₹{offer.minBookingAmount.toLocaleString('en-IN')}</p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Payment Mode Toggle */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Payment Option</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMode('FULL')}
                className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                  paymentMode === 'FULL'
                    ? 'border-[#072720] bg-[#072720]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {paymentMode === 'FULL' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#072720] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                )}
                <p className="text-xs font-medium text-[#072720]">Pay Full</p>
                <p className="text-[10px] text-gray-400 mt-0.5">₹{total.toLocaleString('en-IN')}</p>
              </button>
              <button
                onClick={() => setPaymentMode('ADVANCE')}
                className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                  paymentMode === 'ADVANCE'
                    ? 'border-[#072720] bg-[#072720]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {paymentMode === 'ADVANCE' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#072720] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                )}
                <p className="text-xs font-medium text-[#072720]">Pay 30% Now</p>
                <p className="text-[10px] text-gray-400 mt-0.5">₹{advanceAmount.toLocaleString('en-IN')}</p>
              </button>
            </div>
            {paymentMode === 'ADVANCE' && (
              <p className="text-[10px] text-amber-600 mt-1.5 flex items-center gap-1">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Balance ₹{balanceAmount.toLocaleString('en-IN')} due at check-in
              </p>
            )}
          </div>

          {/* Experiences & Add-Ons Picker */}
          {experiences.length > 0 && onToggleAddon && (
            <div className="mb-4">
              <button
                onClick={() => setShowAddons(!showAddons)}
                className="w-full text-left text-xs text-[#072720] hover:text-[#0a3a30] flex items-center gap-1.5 transition-colors font-medium"
              >
                <svg className="w-3.5 h-3.5 text-[#C09A59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                {showAddons ? 'Hide experiences' : 'Add experiences & extras'}
                {selectedAddons.length > 0 && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-[#C09A59] text-white text-[9px] flex items-center justify-center font-bold">{selectedAddons.length}</span>
                )}
                <svg className={`w-3 h-3 ml-auto transition-transform ${showAddons ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {showAddons && (
                <div className="mt-2 space-y-1.5 max-h-52 overflow-y-auto">
                  {experiences.map((exp) => {
                    const isAdded = selectedAddons.some((a) => a.name === exp.name);
                    return (
                      <button
                        key={exp.name}
                        onClick={() => onToggleAddon(exp)}
                        className={`w-full text-left flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          isAdded
                            ? 'border-[#072720] bg-[#072720]/5'
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                            isAdded ? 'bg-[#072720] text-white' : 'border border-gray-200'
                          }`}>
                            {isAdded && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs font-medium text-[#072720] truncate">{exp.name}</span>
                        </div>
                        <span className="text-xs font-serif text-[#072720] flex-shrink-0 ml-2">₹{exp.price.toLocaleString('en-IN')}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Special Requests Toggle */}
          <button
            onClick={() => setShowRequests(!showRequests)}
            className="w-full text-left text-xs text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1 transition-colors"
          >
            <svg className={`w-3 h-3 transition-transform ${showRequests ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            Special Requests
          </button>
          {showRequests && (
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="E.g. early check-in, birthday decoration..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-[#072720] outline-none focus:border-[#072720] resize-none mb-4 placeholder:text-gray-300"
              rows={3}
              maxLength={1000}
            />
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 mb-5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>₹{pricePerNight.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {selectedAddons.length > 0 && selectedAddons.map((addon) => (
              <div key={addon.name} className="flex justify-between text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#C09A59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  {addon.name}
                </span>
                <span>₹{(addon.price * addon.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon discount</span>
                <span>−₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Taxes & fees (18%)</span>
              <span>₹{taxes.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-medium text-[#072720]">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            {paymentMode === 'ADVANCE' && (
              <>
                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between text-[#072720]">
                  <span className="font-medium">Pay Now (30%)</span>
                  <span className="font-semibold">₹{advanceAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Due at check-in</span>
                  <span>₹{balanceAmount.toLocaleString('en-IN')}</span>
                </div>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          {/* CTAs */}
          <button
            onClick={handleBookNow}
            disabled={isLoading || !checkIn || !checkOut}
            className="w-full py-3.5 bg-[#072720] text-white text-sm font-medium rounded-xl hover:bg-[#0a3a30] transition-colors duration-300 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {getButtonText()}
              </span>
            ) : getButtonText()}
          </button>
          <button
            onClick={checkAvailability}
            disabled={isLoading || !checkIn || !checkOut}
            className="w-full py-3 bg-transparent border border-gray-200 text-[#072720] text-sm font-medium rounded-xl hover:bg-[#EFE7E7] transition-colors duration-300 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookingState === 'checking' ? 'Checking...' : bookingState === 'available' ? '✓ Available' : 'Check Availability'}
          </button>

          {/* Availability badge */}
          {bookingState === 'available' && availabilityData && (
            <div className="mb-3 px-3 py-2 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700 text-center">
              ✓ Available for {nights} night{nights > 1 ? 's' : ''}
            </div>
          )}

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
      <div className="fixed bottom-[76px] left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 py-3 z-[80] lg:hidden transition-all duration-300">
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
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="px-7 py-3 bg-[#072720] text-white text-sm font-medium rounded-xl hover:bg-[#0a3a30] transition-colors duration-300"
          >
            {checkIn && checkOut ? 'Confirm Booking' : 'Select Dates'}
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Booking Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-[32px] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Handle Bar */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-50">
              <h3 className="text-lg font-serif font-medium text-[#072720]">Complete your booking</h3>
              <button 
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Scroll Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
              <div className="space-y-6">
                {/* Price Summary */}
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-serif font-medium text-[#072720]">₹{pricePerNight.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-gray-400 ml-1">/ night</span>
                  </div>
                  {originalPrice && (
                    <span className="text-xs font-medium text-green-600 bg-white px-2 py-0.5 rounded-full border border-green-100">
                      {discount}% off applied
                    </span>
                  )}
                </div>

                {/* Dates */}
                <div>
                  <DatePicker
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onCheckInChange={(v) => { setCheckIn(v); setBookingState('idle'); setAvailabilityData(null); }}
                    onCheckOutChange={(v) => { setCheckOut(v); setBookingState('idle'); setAvailabilityData(null); }}
                    unavailableDates={unavailableDates}
                    minDate={minDate}
                  />
                </div>

                {/* Guest Details */}
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-2xl p-4">
                    <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Primary Guest Name</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full text-base font-medium text-[#072720] outline-none bg-transparent placeholder:text-gray-300"
                    />
                  </div>
                  {!user && (
                    <div className="border border-gray-200 rounded-2xl p-4">
                      <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Phone Number</label>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-gray-400">+91</span>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="10-digit number"
                          className="w-full text-base font-medium text-[#072720] outline-none bg-transparent placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Total Guests</label>
                      <span className="text-base font-medium text-[#072720]">{guests} Persons</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                      </button>
                      <button
                        onClick={() => setGuests(Math.min(maxGuests || 20, guests + 1))}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coupons */}
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setAppliedCoupon(null);
                        }}
                        placeholder="Have a coupon?"
                        className="flex-1 px-4 py-3 text-base text-[#072720] outline-none placeholder:text-gray-300"
                      />
                      <button
                        onClick={validateCoupon}
                        disabled={!couponCode.trim()}
                        className="px-6 text-sm font-semibold text-[#072720] active:bg-gray-50 transition-colors disabled:text-gray-300 border-l border-gray-100"
                      >
                        {appliedCoupon ? '✓ Applied' : 'Apply'}
                      </button>
                    </div>
                    {appliedCoupon && (
                      <div className="px-4 py-2 bg-green-50 border-t border-green-100 flex items-center justify-between">
                        <span className="text-xs text-green-700">{appliedCoupon.title}</span>
                        <span className="text-xs font-medium text-green-700">−₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {!appliedCoupon && (
                    <div>
                      <button
                        onClick={() => {
                          setShowCoupons(!showCoupons);
                          if (availableCoupons.length === 0) {
                            fetch('/api/offers')
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) setAvailableCoupons(data.data.offers);
                              })
                              .catch(() => {});
                          }
                        }}
                        className="w-full text-left text-sm text-[#072720] flex items-center gap-2 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        </svg>
                        {showCoupons ? 'Hide available coupons' : 'View available coupons'}
                        <svg className={`w-4 h-4 ml-auto transition-transform ${showCoupons ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {showCoupons && (
                        <div className="mt-3 space-y-3">
                          {availableCoupons.length === 0 ? (
                            <p className="text-xs text-gray-400">Loading coupons...</p>
                          ) : (
                            availableCoupons.map((offer) => (
                              <button
                                key={offer.code}
                                onClick={() => {
                                  setCouponCode(offer.code);
                                  setShowCoupons(false);
                                }}
                                className="w-full text-left border border-dashed border-gray-200 rounded-2xl p-4 hover:border-[#072720] active:bg-[#072720]/[0.02] transition-all"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-bold tracking-wider text-[#072720] font-mono">{offer.code}</span>
                                  <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                                    {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{offer.title}</p>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Option */}
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Payment Option</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMode('FULL')}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                        paymentMode === 'FULL'
                          ? 'border-[#072720] bg-[#072720]/5'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <p className="text-sm font-bold text-[#072720]">Pay Full</p>
                      <p className="text-xs text-gray-400 mt-1">₹{total.toLocaleString('en-IN')}</p>
                    </button>
                    <button
                      onClick={() => setPaymentMode('ADVANCE')}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                        paymentMode === 'ADVANCE'
                          ? 'border-[#072720] bg-[#072720]/5'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <p className="text-sm font-bold text-[#072720]">Pay 30%</p>
                      <p className="text-xs text-gray-400 mt-1">₹{advanceAmount.toLocaleString('en-IN')}</p>
                    </button>
                  </div>
                  {paymentMode === 'ADVANCE' && (
                    <p className="text-[11px] text-amber-600 flex items-center gap-1.5 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Balance ₹{balanceAmount.toLocaleString('en-IN')} due at check-in
                    </p>
                  )}
                </div>

                {/* Experiences & Add-Ons Picker (Mobile) */}
                {experiences.length > 0 && onToggleAddon && (
                  <div>
                    <button
                      onClick={() => setShowAddons(!showAddons)}
                      className="w-full text-left text-sm text-[#072720] flex items-center gap-2 font-medium"
                    >
                      <svg className="w-4 h-4 text-[#C09A59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      Add Experiences & Extras
                      {selectedAddons.length > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#C09A59] text-white text-[10px] flex items-center justify-center font-bold">{selectedAddons.length}</span>
                      )}
                      <svg className={`w-4 h-4 ml-auto transition-transform ${showAddons ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {showAddons && (
                      <div className="mt-3 space-y-2">
                        {experiences.map((exp) => {
                          const isAdded = selectedAddons.some((a) => a.name === exp.name);
                          return (
                            <button
                              key={exp.name}
                              onClick={() => onToggleAddon(exp)}
                              className={`w-full text-left flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                                isAdded
                                  ? 'border-[#072720] bg-[#072720]/5'
                                  : 'border-gray-100 active:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                  isAdded ? 'bg-[#072720] text-white' : 'border-2 border-gray-200'
                                }`}>
                                  {isAdded && (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-[#072720] truncate">{exp.name}</p>
                                  <p className="text-[11px] text-gray-400 truncate">{exp.description}</p>
                                </div>
                              </div>
                              <span className="text-sm font-serif font-medium text-[#072720] flex-shrink-0 ml-3">₹{exp.price.toLocaleString('en-IN')}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Special Requests */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowRequests(!showRequests)}
                    className="w-full text-left text-sm text-[#072720] flex items-center gap-2 font-medium"
                  >
                    <svg className={`w-4 h-4 transition-transform ${showRequests ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Special Requests (Optional)
                  </button>
                  {showRequests && (
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="E.g. early check-in, dietary requirements..."
                      className="w-full border border-gray-200 rounded-2xl p-4 text-base text-[#072720] outline-none focus:border-[#072720] resize-none placeholder:text-gray-300"
                      rows={3}
                    />
                  )}
                </div>

                {/* Payment Breakdown */}
                <div className="space-y-3 pb-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Rate x {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedAddons.length > 0 && selectedAddons.map((addon) => (
                    <div key={addon.name} className="flex justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#C09A59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {addon.name}
                      </span>
                      <span>₹{(addon.price * addon.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>−₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Taxes & Fees</span>
                    <span>₹{taxes.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between font-serif text-lg font-medium text-[#072720]">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer with Button */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
              <button
                onClick={() => {
                  if (bookingState === 'available') {
                    handleBookNow();
                  } else {
                    checkAvailability();
                  }
                }}
                disabled={isLoading || !checkIn || !checkOut}
                className="w-full py-4 bg-[#072720] text-white font-semibold rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : bookingState === 'available' ? 'Pay & Confirm' : 'Check Availability'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setShowLogin(false);
          // Auto-trigger booking after login
          setTimeout(() => handleBookNow(), 300);
        }}
      />

      {/* Booking Confirmation */}
      {bookingState === 'confirmed' && confirmedBooking && (
        <BookingConfirmation
          booking={confirmedBooking}
          onClose={() => {
            setConfirmedBooking(null);
            setBookingState('idle');
            setCheckIn('');
            setCheckOut('');
            setGuests(2);
            setCouponCode('');
            setAppliedCoupon(null);
            setSpecialRequests('');
          }}
        />
      )}
    </>
  );
}
