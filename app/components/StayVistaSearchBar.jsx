'use client';

export default function StayVistaSearchBar() {
  return (
    <div className="relative z-20 -mt-10 md:-mt-14 px-6 md:px-10">
      <div className="mx-auto max-w-6xl bg-white rounded-[2rem] md:rounded-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] p-2 md:p-2.5 border border-gray-100 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center">
          {/* Location */}
          <div className="flex-[1.2] px-8 py-5 md:py-4 text-left md:border-r border-gray-100 hover:bg-gray-50/80 transition-colors rounded-t-[1.8rem] md:rounded-l-full md:rounded-tr-none">
            <label className="block text-[9px] md:text-[10px] font-bold text-foreground/40 uppercase tracking-[0.25em] mb-1">Destination</label>
            <input 
              type="text" 
              placeholder="Where are you going?" 
              className="w-full bg-transparent text-foreground font-semibold text-sm md:text-base outline-none placeholder:text-foreground/25" 
            />
          </div>

          {/* Dates */}
          <div className="flex-1 px-8 py-5 md:py-4 text-left border-t md:border-t-0 md:border-r border-gray-100 hover:bg-gray-50/80 transition-colors">
            <label className="block text-[9px] md:text-[10px] font-bold text-foreground/40 uppercase tracking-[0.25em] mb-1">Check-in / Out</label>
            <p className="text-sm md:text-base font-semibold text-foreground/25">Select dates</p>
          </div>

          {/* Guests */}
          <div className="flex-1 px-8 py-5 md:py-4 text-left border-t md:border-t-0 md:border-r border-gray-100 hover:bg-gray-50/80 transition-colors">
            <label className="block text-[9px] md:text-[10px] font-bold text-foreground/40 uppercase tracking-[0.25em] mb-1">Guests</label>
            <p className="text-sm md:text-base font-semibold text-foreground/25">Add guests</p>
          </div>

          {/* Search Button */}
          <div className="p-2 md:p-0 md:pr-1">
            <button className="w-full md:w-auto h-14 md:h-16 px-12 bg-foreground text-white rounded-2xl md:rounded-full font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-foreground/90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
