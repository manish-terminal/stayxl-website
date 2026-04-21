'use client';

import Image from 'next/image';

export default function StayVistaHero() {
  return (
    <section className="relative h-[55vh] md:h-[75vh] w-full overflow-hidden">
      {/* Background with subtle zoom animation */}
      <div className="absolute inset-0 animate-slowZoom">
        <Image
          src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Villa"
          fill
          priority
          className="object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <div className="animate-fadeInUp">
          <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.5em] mb-4 md:mb-6 opacity-90">
            StayXL • Handpicked Excellence
          </p>
          <h1 className="text-3xl md:text-8xl font-bold mb-4 md:mb-8 tracking-tighter leading-[1.1] max-w-4xl mx-auto">
            Exceptional Stays, <br className="hidden md:block" /> Curated for You
          </h1>
          <p className="text-[10px] md:text-lg font-light tracking-[0.1em] opacity-80 max-w-[280px] md:max-w-2xl mx-auto italic leading-relaxed">
            "Experience the soul of luxury in our curated collection of private estates"
          </p>
        </div>
      </div>
      
      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      
      <style jsx global>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        .animate-slowZoom {
          animation: slowZoom 20s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
