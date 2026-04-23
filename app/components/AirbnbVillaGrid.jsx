'use client';

import Image from 'next/image';
import Link from 'next/link';
import { villas } from '../data/villas';
import { useState } from 'react';

function VillaCard({ villa }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group cursor-pointer">
      <div className="flex flex-col gap-2 w-full">
        {/* Image Container */}
        <div className="aspect-square relative overflow-hidden rounded-xl">
          <Image
            src={villa.images[0]}
            alt={villa.name}
            fill
            className="object-cover h-full w-full group-hover:scale-105 transition"
          />
          <div className="absolute top-3 right-3">
             <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorite(!isFavorite);
                }}
                className="relative hover:opacity-80 transition"
             >
                <svg
                  viewBox="0 0 32 32"
                  className={`w-6 h-6 stroke-white stroke-2 ${isFavorite ? 'fill-primary' : 'fill-black/50'}`}
                >
                  <path d="m16 28c7-4.733 14-10 14-17 0-3.867-3.133-7-7-7-2.544 0-4.846 1.308-6.196 3.412l-.804 1.254-.804-1.254c-1.35-2.104-3.652-3.412-6.196-3.412-3.867 0-7 3.133-7 7 0 7 7 12.267 14 17z" />
                </svg>
             </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-row items-center justify-between">
            <div className="font-semibold text-base truncate">
              {villa.location}
            </div>
            <div className="flex flex-row items-center gap-1">
              <svg viewBox="0 0 32 32" className="w-3 h-3 fill-current">
                <path d="M15.094 1.579l-4.146 8.4a1.5 1.5 0 0 1-1.13.82l-9.273 1.347a1.5 1.5 0 0 0-.83 2.558l6.71 6.54a1.5 1.5 0 0 1 .43 1.325l-1.585 9.235a1.5 1.5 0 0 0 2.176 1.581l8.295-4.36a1.5 1.5 0 0 1 1.396 0l8.295 4.36a1.5 1.5 0 0 0 2.176-1.581l-1.585-9.235a1.5 1.5 0 0 1 .43-1.325l6.71-6.54a1.5 1.5 0 0 0-.83-2.558l-9.273-1.347a1.5 1.5 0 0 1-1.13-.82l-4.146-8.4a1.5 1.5 0 0 0-2.69 0z" />
              </svg>
              <span className="text-sm font-light">
                {villa.rating}
              </span>
            </div>
          </div>
          <div className="font-light text-text-light text-sm">
            {villa.name}
          </div>
          <div className="font-light text-text-light text-sm">
            Aug 12 - 17
          </div>
          <div className="flex flex-row items-center gap-1 mt-1">
            <div className="font-semibold">
              ₹{villa.pricePerNight.toLocaleString()}
            </div>
            <div className="font-light">night</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AirbnbVillaGrid() {
  return (
    <section className="pt-8 pb-20">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {villas.map((villa) => (
            <Link key={villa.id} href={`/villas/${villa.slug}`}>
               <VillaCard villa={villa} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
