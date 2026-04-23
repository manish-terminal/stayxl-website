'use client';

import Image from 'next/image';

export default function GoaTeaser() {
  return (
    <section className="py-16 bg-white border-t border-border-light">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070&auto=format&fit=crop"
            alt="Goa"
            fill
            className="object-cover brightness-[0.7] group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-primary">Unlocking Soon</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">StayXL in Goa</h2>
            <p className="max-w-md text-sm md:text-base font-light mb-8 text-white/90 leading-relaxed">
              Coastal horizons meet the StayXL standard. From North Goa vibes to South Goa serenity, 
              we're handpicking the finest villas for your next getaway.
            </p>
            <div className="flex w-full max-w-sm rounded-full bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
               <input 
                 type="email" 
                 placeholder="Get notified" 
                 className="flex-1 bg-transparent px-6 py-3 text-sm text-white placeholder:text-white/60 outline-none"
               />
               <button className="bg-white text-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition">
                 Join
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
