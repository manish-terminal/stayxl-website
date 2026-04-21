'use client';

import { MapPin, Lock } from 'lucide-react';

export default function LocationPopup({ locations, onSelect, selectedLocation, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-4 w-full md:w-[450px] bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-6 md:p-8 z-[100] md:z-50 animate-fadeInUp">
      <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-4 md:mb-6 px-2">Suggested destinations</h3>
      
      <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => !loc.isLocked && onSelect(loc)}
            disabled={loc.isLocked}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
              loc.isLocked 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-gray-50 active:scale-95'
            } ${selectedLocation?.id === loc.id ? 'bg-bg-soft ring-1 ring-accent/30' : ''}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${loc.isLocked ? 'bg-gray-100' : 'bg-bg-soft'}`}>
              {loc.isLocked ? (
                <Lock className="w-5 h-5 text-foreground/40" />
              ) : (
                <MapPin className="w-5 h-5 text-accent" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{loc.name}</span>
                {loc.isLocked && <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full">Coming Soon</span>}
              </div>
              <p className="text-xs text-text-muted mt-0.5">{loc.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
