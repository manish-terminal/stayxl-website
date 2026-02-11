'use client';

import { useState, useRef, useEffect } from 'react';

const partners = [
  { name: 'Airbnb', initials: 'Airbnb' },
  { name: 'Booking.com', initials: 'Booking' },
  { name: 'MakeMyTrip', initials: 'MMT' },
  { name: 'Goibibo', initials: 'Goibibo' },
  { name: 'Agoda', initials: 'Agoda' },
  { name: 'TripAdvisor', initials: 'TripAdv' },
  { name: 'Visa', initials: 'Visa' },
  { name: 'Mastercard', initials: 'MC' },
  { name: 'Razorpay', initials: 'Rzp' },
  { name: 'Google Pay', initials: 'GPay' },
  { name: 'PhonePe', initials: 'PhonePe' },
  { name: 'Paytm', initials: 'Paytm' },
];

function PartnerLogo({ name, initials }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 group/logo"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="w-28 h-16 md:w-32 md:h-[72px] rounded-xl bg-white flex items-center justify-center mx-3 shadow-sm grayscale opacity-50 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:shadow-md group-hover/logo:scale-105 transition-all duration-300 cursor-pointer">
        <span className="text-[#072720] text-sm font-semibold tracking-wide">{initials}</span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#072720] text-white text-[10px] tracking-wider whitespace-nowrap z-10 animate-fadeIn">
          {name}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#072720]"></div>
        </div>
      )}
    </div>
  );
}

export default function PartnerCarousel() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Infinite auto-scroll
  useEffect(() => {
    if (!scrollRef.current || isPaused) return;
    const el = scrollRef.current;
    let animationId;
    let scrollPos = 0;

    const animate = () => {
      scrollPos += 0.5;
      // Reset when we've scrolled past the first set of logos
      const halfWidth = el.scrollWidth / 2;
      if (scrollPos >= halfWidth) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Duplicate partners for seamless infinite loop
  const displayPartners = [...partners, ...partners];

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-1000 delay-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Carousel Container */}
      <div className="relative">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#EFE7E7] to-transparent z-10 pointer-events-none"></div>
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#EFE7E7] to-transparent z-10 pointer-events-none"></div>

        <div
          ref={scrollRef}
          className="flex overflow-x-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {displayPartners.map((partner, index) => (
            <PartnerLogo key={index} {...partner} />
          ))}
        </div>
      </div>
    </div>
  );
}
