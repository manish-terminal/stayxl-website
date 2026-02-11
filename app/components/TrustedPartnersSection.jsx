'use client';

import { useState, useRef, useEffect } from 'react';
import TrustMetrics from './TrustMetrics';
import PartnerCarousel from './PartnerCarousel';
import TrustBadgeStrip from './TrustBadgeStrip';

export default function TrustedPartnersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#EFE7E7] py-10 md:py-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8">

        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-8 md:mb-10 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Label */}
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#072720]/40 font-semibold mb-4">
            Trusted Worldwide
          </p>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-[#072720] tracking-wide leading-snug mb-4">
            Book With Confidence Across
            <br className="hidden md:block" />
            Global Platforms
          </h2>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed">
            Our villas are listed and verified across the world&apos;s most trusted travel and payment partners.
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="mb-8 md:mb-10">
          <TrustMetrics />
        </div>

        {/* Partner Carousel */}
        <div className="mb-8 md:mb-10">
          <PartnerCarousel />
        </div>

        {/* Trust Badge Strip */}
        <div
          className={`transition-all duration-1000 delay-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <TrustBadgeStrip />
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-1000 delay-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >

        </div>

      </div>
    </section>
  );
}
