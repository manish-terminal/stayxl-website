'use client';

import Image from 'next/image';

const features = [
  {
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1000&auto=format&fit=crop',
    title: 'Verified & Maintained',
    description: 'Every StayXL villa undergoes rigorous quality checks to ensure a seamless and premium stay.',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
    title: 'Meals Available',
    description: 'Enjoy barbecue grills, fully-equipped kitchens, and catering support for your groups.',
  },
  {
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop',
    title: 'XL Premium Villa',
    description: 'Expansive outdoor pools, large property layouts, and wide open spaces for absolute privacy.',
  },
  {
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop',
    title: 'Event-Friendly',
    description: 'Decorated outdoor setups perfectly tailored for celebrations, parties, and large gatherings.',
  },
];

export default function StayXLExperience() {
  return (
    <section className="py-10 bg-[#F9F7F5] rounded-3xl overflow-hidden">
      <div className="px-6 md:px-10">
        <h2 className="text-xl md:text-2xl  font-light text-[#072720] mb-8">
          The StayXL Experience
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col group">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-[#072720] tracking-wide mb-2">
                {feature.title}
              </h3>
              <p className="text-[11px] leading-relaxed text-[#072720]/60">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
