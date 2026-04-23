'use client';

import Image from 'next/image';
import { getVillasByCollection } from '../utils/classifyVillas';
import RevealOnScroll from './RevealOnScroll';

export default function StayVistaCollections() {
  const collections = getVillasByCollection();

  return (
    <section className="section-tighter bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <RevealOnScroll>
          <div className="mb-12 md:mb-16">
             <span className="tagline mb-2 block">Curation</span>
             <h2 className="heading-section text-4xl md:text-6xl">Browse by Collection</h2>
          </div>
        </RevealOnScroll>
        
        <div className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-8 px-1">
          {collections.map((item, index) => (
            <RevealOnScroll key={item.name} delay={index * 100}>
              <div className="group flex-shrink-0 w-[280px] md:w-[360px] cursor-pointer lift-on-hover">
                <div className="relative aspect-[16/10] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-4 shadow-sm transition-all duration-700">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-[1500ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
                     <h4 className="text-xl md:text-2xl font-bold tracking-tight mb-1">{item.name}</h4>
                     <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                        {typeof item.count === 'number' ? `${item.count} Handpicked Stays` : item.count}
                     </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
