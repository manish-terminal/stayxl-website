'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function HeroGallery({ images = [], name, rating, reviewCount, location, highlights = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const mainImage = images[activeIndex] || images[0];

  return (
    <section className="relative">
      {/* Main Gallery Grid */}
      <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1.5 md:rounded-2xl overflow-hidden md:h-[480px]">
          {/* Main Image */}
          <div
            className="relative col-span-1 md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto cursor-pointer group overflow-hidden"
            onClick={() => setActiveIndex(0)}
          >
            <Image
              src={images[0] || ''}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden"></div>

            {/* Mobile overlay info */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:hidden">
              <h1 className="text-xl font-serif font-light text-white mb-1">{name}</h1>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{rating} ({reviewCount} reviews)</span>
                <span className="text-white/30">·</span>
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* Secondary Images */}
          {images.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative hidden md:block cursor-pointer group overflow-hidden"
              onClick={() => setActiveIndex(i + 1)}
            >
              <Image
                src={img}
                alt={`${name} - ${i + 2}`}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Show All overlay on last */}
              {i === 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="flex items-center gap-1.5 text-white text-xs tracking-wider font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    Show all
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons (floating top-right on desktop) */}
      <div className="absolute top-4 right-4 md:top-6 md:right-10 flex items-center gap-2 z-10">
        {/* Share */}
        <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-300" aria-label="Share">
          <svg className="w-4 h-4 text-[#072720]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-300"
          aria-label="Save"
        >
          <svg
            className={`w-4 h-4 transition-colors duration-300 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-[#072720]'}`}
            fill={isWishlisted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Desktop Info Bar (below gallery) */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-light text-[#072720] mb-2">{name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#C6A87D]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium text-[#072720]">{rating}</span>
                <span className="text-gray-400">({reviewCount} reviews)</span>
              </div>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{location}</span>
              </div>
            </div>
            {/* Highlight Tags */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {highlights.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-[#EFE7E7] text-[#072720]/70 text-[11px] tracking-wider font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Thumbnail Strip */}
      <div className="md:hidden px-4 py-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
        {images.slice(0, 5).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden transition-all duration-200 ${
              activeIndex === i ? 'ring-2 ring-[#072720] ring-offset-1' : 'opacity-60'
            }`}
          >
            <Image src={img} alt="" fill sizes="56px" className="object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
