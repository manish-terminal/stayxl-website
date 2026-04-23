'use client';

import Image from 'next/image';
import Link from 'next/link';
import { villas } from '../data/villas';
import RevealOnScroll from './RevealOnScroll';


function ClassyVillaCard({ villa }) {
  return (
    <div className="group bg-white rounded-[2rem] md:rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 border border-black/[0.04]">
      <Link href={`/villas/${villa.slug}`} className="block">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={villa.images[0]}
            alt={villa.name}
            fill
            className="object-cover transition-transform duration-[1500ms] group-hover:scale-110"
          />
          {/* Location Tag */}
          <div className="absolute top-6 left-6">
            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground shadow-sm">
              {villa.location}
            </span>
          </div>


        </div>

        {/* Content Section */}
        <div className="p-5 md:p-7 relative">

          <div className="flex justify-between items-start mb-4 md:mb-5">
            <div className="flex-1 min-w-0 pr-2 md:pr-4">
              {/* Title & Rating */}
              <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                <h3 className="text-[22px] md:text-[28px] font-semibold text-foreground tracking-tight group-hover:text-accent transition-colors leading-tight truncate">
                  {villa.name}
                </h3>
                <div className="flex shrink-0 items-center gap-1 text-[11px] md:text-xs font-semibold text-foreground/80 bg-gray-50/80 px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3 text-foreground" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {villa.rating}
                </div>
              </div>

              {/* Minimal Basic Info */}
              <div className="flex flex-wrap items-center gap-2 text-[12px] md:text-[13px] text-text-muted/80 font-medium tracking-wide">
                <span>{villa.guests} Guests</span>
                <span className="text-gray-300/80">•</span>
                <span>{villa.bedrooms} Bedrooms</span>
                <span className="text-gray-300/80">•</span>
                <span>{villa.bathrooms} Baths</span>
                {villa.extraMattress && (
                  <>
                    <span className="text-gray-300/80">•</span>
                    <span>Extra Mattress</span>
                  </>
                )}
              </div>

              {/* Ultra Clean Amenities */}
              {villa.amenities?.popular && (
                <div className="flex flex-nowrap items-center gap-1.5 mt-3 md:mt-4 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                  {villa.amenities.popular.map((amenity, i) => (
                    <span key={i} className="whitespace-nowrap shrink-0 text-[10.5px] md:text-[11.5px] font-medium bg-black/[0.03] text-foreground/75 px-3 py-1.5 rounded-full">
                      {amenity}
                    </span>
                  ))}
                  {(() => {
                    const allAmenities = new Set([
                      ...(villa.amenities.popular || []),
                      ...(villa.amenities.kitchen || []),
                      ...(villa.amenities.outdoor || []),
                      ...(villa.amenities.entertainment || [])
                    ]);
                    return (
                      <span className="whitespace-nowrap shrink-0 text-[10.5px] md:text-[11.5px] font-medium bg-gray-100/80 text-foreground/70 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                        {allAmenities.size}+ Amenities
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Clean Pricing Footer */}
          <div className="flex items-center justify-between pt-2 md:pt-4">
             <div>
                <p className="text-[20px] md:text-[24px] font-medium text-foreground tracking-tight leading-none">
                    ₹{villa.pricePerNight.toLocaleString()}
                </p>
                <p className="text-[10.5px] md:text-[11.5px] font-medium text-text-muted/70 mt-1.5">
                    per night, for upto {villa.guests} guests
                </p>
             </div>
             <span className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/[0.03] flex items-center justify-center group-hover:bg-foreground group-hover:text-white transition-all duration-300">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
             </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ClassyVillaGrid() {
  return (
    <section id="villa-grid" className="section-tighter bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <RevealOnScroll>
          <div className="mb-14 md:mb-20">
            <span className="tagline mb-2 block">Our Collection</span>
            <h2 className="heading-section text-4xl md:text-7xl">Exceptional Stays</h2>
          </div>
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {villas.map((villa, index) => (
            <RevealOnScroll key={villa.id} delay={index * 100}>
               <ClassyVillaCard villa={villa} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
