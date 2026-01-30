'use client';

import { useState, useEffect } from 'react';
import HeroSlider from './HeroSlider';
import BookingSearchBar from './BookingSearchBar';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  // Fade-in animation on load
  useEffect(() => {
    setIsVisible(true);
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

  const currentSlide = slides[0]; // You can make this dynamic if needed

  return (
    <section className="relative h-[85vh] min-h-[500px] w-full ">
      {/* Hero Slider Background */}
      <HeroSlider slides={slides} />

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
        <div
          className={`text-center max-w-4xl transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-white mb-6 md:mb-8 tracking-wide leading-tight">
            Monday Blues Sale
          </h1>

          {/* Subtitle Badge */}
          <div className="inline-block">
            <button className="px-8 py-3 md:px-10 md:py-4 border-2 border-white bg-transparent text-white text-base md:text-lg font-light tracking-wide rounded-full hover:bg-white hover:text-[#072720] transition-all duration-300 shadow-lg hover:shadow-xl">
              26% OFF on All Monday Stays
            </button>
          </div>
        </div>
      </div>

      {/* Floating Booking Search Bar */}
      <div className="absolute bottom-4 left-0 right-0 z-20 pb-8 md:pb-12">
        <BookingSearchBar />
      </div>
    </section>
  );
}
