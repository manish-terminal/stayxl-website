'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function ExperienceCard({ title, description, image, badge, slug }) {
  return (
    <Link 
      href={`/experiences/${slug}`}
      className="flex-shrink-0 w-[78vw] sm:w-[60vw] md:w-auto group cursor-pointer block text-left"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-shadow duration-500">
        <Image
          src={image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'}
          alt={title}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 768px) 60vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#072720]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Arrow CTA Button */}
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-300 hover:bg-white hover:shadow-md">
          <svg className="w-4 h-4 text-[#072720]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#072720] text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-[#072720] mb-1.5 tracking-wide group-hover:text-[#C09A59] transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed mb-3 max-w-[260px]">
        {description}
      </p>
    </Link>
  );
}

function ExperienceSkeleton() {
  return (
    <div className="flex-shrink-0 w-[78vw] sm:w-[60vw] md:w-full animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-gray-100 mb-4" />
      <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

export default function EventsSection() {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch('/api/experiences');
        const data = await res.json();
        if (data.success) {
          setExperiences(data.data.experiences);
        }
      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

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
            Experiences & Add-Ons
          </h2>

          <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed">
            Enhance your stay with curated services and unforgettable luxury experiences.
          </p>
        </div>

        {/* Grid / Carousel Area */}
        <div
          className={`transition-all duration-1000 delay-200 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ExperienceSkeleton key={i} />
              ))}
            </div>
          ) : experiences.length > 0 ? (
            <>
              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {experiences.map((exp) => (
                  <ExperienceCard 
                    key={exp.id} 
                    title={exp.heading}
                    description={exp.subtext}
                    image={exp.heroImage}
                    badge={exp.caption}
                    slug={exp.slug}
                  />
                ))}
              </div>

              {/* Mobile Carousel */}
              <div
                className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6"
                style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: '24px' }}
              >
                {experiences.map((exp) => (
                  <div key={exp.id} style={{ scrollSnapAlign: 'start' }}>
                    <ExperienceCard 
                      title={exp.heading}
                      description={exp.subtext}
                      image={exp.heroImage}
                      badge={exp.caption}
                      slug={exp.slug}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">No experiences available at the moment.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
