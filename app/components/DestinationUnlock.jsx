'use client';

import Image from 'next/image';

export default function DestinationUnlock() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 items-center">
          
          {/* Hyderabad Section */}
          <div className="group relative overflow-hidden rounded-2xl shadow-airbnb shadow-airbnb-hover">
             <div className="relative h-[500px]">
                <Image 
                  src="https://images.unsplash.com/photo-1572435232898-47da19f4a03a?q=80&w=2070&auto=format&fit=crop"
                  alt="Hyderabad"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white">
                   <p className="subheading-editorial mb-4 !text-white">Destination I</p>
                   <h2 className="heading-editorial text-5xl mb-6">The Heart of <br/> Hyderabad</h2>
                   <button className="rounded-full border border-white/40 px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-foreground">
                      Explore the collection
                   </button>
                </div>
             </div>
          </div>

          {/* Goa Section - Coming Soon */}
          <div className="group relative overflow-hidden rounded-2xl bg-foreground">
             <div className="relative h-[500px] opacity-60 grayscale-[0.5]">
                <Image 
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070&auto=format&fit=crop"
                  alt="Goa"
                  fill
                  className="object-cover blur-[2px]"
                />
                <div className="absolute inset-0 bg-accent/20" />
             </div>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white">
                <div className="mb-6 rounded-full border border-accent bg-accent/10 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                   Unlocking Soon
                </div>
                <h2 className="heading-editorial text-5xl mb-6">The Soul of <br/> Goa</h2>
                <p className="max-w-xs text-sm font-light leading-relaxed text-white/70 italic">
                  "Coastal horizons meet the StayXL standard. Sign up to be notified when the waves call."
                </p>
                <div className="mt-8 flex w-full max-w-xs overflow-hidden rounded-full border border-white/20">
                   <input 
                     type="email" 
                     placeholder="Your email" 
                     className="w-full bg-transparent px-6 py-3 text-xs outline-none"
                   />
                   <button className="bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-foreground">
                      Join
                   </button>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
