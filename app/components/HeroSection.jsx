'use client';

import { useState, useEffect } from 'react';
import HeroSlider from './HeroSlider';
import BookingSearchBar from './BookingSearchBar';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  // Fade-in animation on load
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Dummy slides data
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
      title: 'Monday Blues Sale',
      subtitle: '26% OFF on All Monday Stays',
    },
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
      title: 'Luxury Villa Escapes',
      subtitle: 'Experience Unparalleled Elegance',
    },
    {
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
      title: 'Weekend Getaways',
      subtitle: 'Book Your Dream Villa Today',
    },
  ];

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full">
      {/* Hero Slider Background */}
      <HeroSlider slides={slides} />

      {/* Hero Content */}
      {/* Hero Content — positioned above center to leave room for search bar anchor */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pb-28 md:pb-36">
        <div
          className={`text-center max-w-4xl transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Decorative line */}
          <div className="w-12 h-px bg-white/40 mx-auto mb-6 md:mb-8"></div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-white mb-4 md:mb-6 tracking-wide leading-tight">
            Monday Blues Sale
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-base md:text-lg font-light tracking-widest uppercase mb-8 md:mb-10">
            26% OFF on All Monday Stays
          </p>

          {/* CTA */}
          <button className="px-8 py-3 md:px-10 md:py-3.5 border border-white/40 bg-transparent text-white text-sm md:text-base font-light tracking-widest uppercase rounded-full hover:bg-white hover:text-[#072720] transition-all duration-500">
            Explore Villas
          </button>
        </div>
      </div>

      {/* Floating Booking Search Bar — visual anchor */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 md:pb-10">
        <BookingSearchBar />
      </div>
    </section>
  );
}
