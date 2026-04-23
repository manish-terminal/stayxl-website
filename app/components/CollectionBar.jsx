'use client';

import { useState } from 'react';

const categories = [
  { name: 'Amazing pools', icon: '🏊' },
  { name: 'Trending', icon: '🔥' },
  { name: 'Countryside', icon: '🏡' },
  { name: 'Design', icon: '✨' },
  { name: 'Amazing views', icon: '🏔️' },
  { name: 'Bed & breakfasts', icon: '🍳' },
  { name: 'Luxe', icon: '💎' },
  { name: 'Castles', icon: '🏰' },
  { name: 'National parks', icon: '🌲' },
  { name: 'Iconic cities', icon: '🏙️' },
];

export default function CollectionBar() {
  const [selected, setSelected] = useState('Amazing pools');

  return (
    <div className="sticky top-[72px] md:top-[80px] z-40 bg-white border-b border-border-light pt-4 md:pt-6">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="flex flex-row items-center justify-between overflow-x-auto scrollbar-hide gap-8">
          {categories.map((item) => (
            <div className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-foreground transition cursor-pointer pb-3 shrink-0 ${
                selected === item.name ? 'border-foreground text-foreground' : 'border-transparent text-text-light'
              }`}
            >
              <span className="text-2xl opacity-70 group-hover:opacity-100">{item.icon}</span>
              <div className="font-semibold text-xs whitespace-nowrap">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
