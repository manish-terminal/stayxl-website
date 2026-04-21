'use client';

import Image from 'next/image';
import Link from 'next/link';
import RevealOnScroll from './RevealOnScroll';

const stories = [
  { id: 1, name: 'Party Vibes', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop' },
  { id: 2, name: 'Morning Brews', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, name: 'Poolside', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, name: 'Retreats', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop' },
  { id: 5, name: 'Luxe Night', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop' },
  { id: 6, name: 'Slow Living', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2071&auto=format&fit=crop' },
];

export default function AestheticStories() {
  return (
    <section className="section-tighter bg-bg-soft overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-16 gap-6">
            <div>
              <span className="tagline mb-2 block">Instagram Stories</span>
              <h2 className="heading-section text-4xl md:text-6xl">Vibe Checks</h2>
            </div>
            <Link href="/gallery" className="px-8 py-3 bg-white border border-gray-100 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              Guest Gallery
            </Link>
          </div>
        </RevealOnScroll>

        <div className="flex gap-6 md:gap-12 overflow-x-auto scrollbar-hide py-4 px-2">
          {stories.map((story, index) => (
            <RevealOnScroll key={story.id} delay={index * 100}>
              <div className="group flex flex-col items-center gap-4 md:gap-5 shrink-0 cursor-pointer">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full insta-ring transition-all group-hover:scale-105 duration-500 shadow-md group-hover:shadow-xl">
                  <div className="insta-ring-inner">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={story.image}
                        alt={story.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover transition-all duration-700"
                      />
                    </div>
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-foreground/60 group-hover:text-foreground transition-colors">
                  {story.name}
                </span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
