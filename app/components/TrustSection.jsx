'use client';

const trustItems = [
  {
    title: 'Curated Stays',
    description: 'Only the best villas, handpicked for you',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Unmatched Service',
    description: 'Dedicated concierge & travel assistance',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Impeccable Villas',
    description: 'Clean, safe, and quality-checked stays',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
];

function TrustItem({ icon, title, description }) {
  return (
    <div className="group flex flex-col items-center text-center px-6 py-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-[#072720]/[0.06] flex items-center justify-center text-[#072720] mb-5 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-[#072720] tracking-wide mb-2 font-serif">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed max-w-[220px]">
        {description}
      </p>
    </div>
  );
}

export default function TrustSection() {
  return (
    <section className="bg-[#EFE7E7] py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-serif font-light text-[#072720] tracking-wide">
            Your Trusted Getaway Partner{' '}
            <span className="inline-block">✨</span>
          </h2>
        </div>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {trustItems.map((item, index) => (
            <TrustItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
