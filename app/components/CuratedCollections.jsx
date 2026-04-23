'use client';

import Image from 'next/image';
import Link from 'next/link';
import { villas } from '../data/villas';

export default function CuratedCollections() {
  // Taking a few villas for the curated section
  const curatedVillas = villas.slice(0, 4);

  return (
    <section className="py-24 bg-bg-muted">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <p className="subheading-editorial mb-4">The Selection</p>
          <h2 className="heading-editorial text-5xl md:text-6xl">Curated for the Soul</h2>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {curatedVillas.map((villa, index) => (
            <Link 
              key={villa.id} 
              href={`/villas/${villa.slug}`}
              className={`group flex flex-col gap-6 ${index % 2 !== 0 ? 'md:mt-24' : ''}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-gray-200">
                <Image
                  src={villa.images[0]}
                  alt={villa.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6">
                  <span className="rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground shadow-sm">
                    {villa.location}
                  </span>
                </div>
              </div>
              
              <div className="flex items-end justify-between border-b border-foreground/10 pb-6">
                <div>
                  <div className="mb-2 flex gap-2">
                    {villa.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-accent">{tag}</span>
                    ))}
                  </div>
                  <h3 className="heading-editorial text-3xl mb-2">{villa.name}</h3>
                  <p className="text-sm text-text-secondary">{villa.guests} Guests · {villa.bedrooms} Bedrooms</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">From</p>
                  <p className="text-xl font-light italic">₹{villa.pricePerNight.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
