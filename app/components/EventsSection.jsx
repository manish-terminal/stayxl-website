'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const defaultEvents = [
  {
    title: 'Destination Weddings',
    description: 'Celebrate your dream wedding at breathtaking hillside and beachfront villas.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
    badge: '100+ weddings hosted',
  },
  {
    title: 'Corporate Retreats',
    description: 'Inspire your team with productive off-sites in serene luxury settings.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    badge: '50+ retreats planned',
  },
  {
    title: 'Birthdays & Anniversaries',
    description: 'Mark your milestones with private celebrations in handpicked villas.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070&auto=format&fit=crop',
    badge: '200+ celebrations organized',
  },
  {
    title: 'Wellness Retreats',
    description: 'Rejuvenate with yoga, spa, and nature in peaceful luxury getaways.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    badge: '30+ wellness getaways',
  },
];

function EventCard({ title, description, image, badge }) {
  return (
    <div className="flex-shrink-0 w-[78vw] sm:w-[60vw] md:w-auto group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-shadow duration-500">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 768px) 60vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#072720]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Arrow CTA Button */}
        <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-300 hover:bg-white hover:shadow-md" aria-label={`Explore ${title}`}>
          <svg className="w-4 h-4 text-[#072720]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-[#072720] mb-1.5 tracking-wide">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed mb-3 max-w-[260px]">
        {description}
      </p>



    </div>
  );
}

export default function EventsSection({ events = defaultEvents }) {
  const scrollRef = useRef(null);
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-12 md:mb-14 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Decorative line */}
          <div className="w-10 h-px bg-[#072720]/20 mx-auto mb-6"></div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-[#072720] tracking-wide leading-snug mb-4">
            Unforgettable Events, Perfect Venues
          </h2>

          <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed">
            From dream weddings to luxury celebrations, our villas create unforgettable experiences.
          </p>
        </div>

        {/* Desktop Grid (hidden on mobile) */}
        <div
          className={`hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-200 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>

        {/* Mobile Carousel (shown only on mobile) */}
        <div
          ref={scrollRef}
          className={`md:hidden flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 transition-all duration-1000 delay-200 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: '24px' }}
        >
          {events.map((event, index) => (
            <div key={index} style={{ scrollSnapAlign: 'start' }}>
              <EventCard {...event} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
