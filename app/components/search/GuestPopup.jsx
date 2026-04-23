'use client';

import { Plus, Minus, Check, Search } from 'lucide-react';

function Counter({ label, subtitle, value, onChange, min = 0 }) {
  return (
    <div className="flex items-center justify-between py-6 border-b border-gray-50 last:border-0">
      <div>
        <h4 className="font-bold text-foreground">{label}</h4>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all ${
            value <= min ? 'opacity-20 cursor-not-allowed' : 'hover:border-foreground active:scale-90'
          }`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-6 text-center font-bold text-lg tabular-nums">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-foreground active:scale-90 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function GuestPopup({ guests, setGuests, isEvent, setIsEvent, onClose, onSearch }) {
  return (
    <div className="absolute top-full right-0 mt-4 w-full md:w-[400px] bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-6 md:p-8 z-[100] md:z-50 animate-fadeInUp">
      <div className="space-y-2">
        <Counter 
          label="Adults" 
          subtitle="Age 18+" 
          value={guests.adults} 
          onChange={(v) => setGuests({ ...guests, adults: v })} 
          min={1}
        />
        <Counter 
          label="Children" 
          subtitle="Ages 0–17" 
          value={guests.children} 
          onChange={(v) => setGuests({ ...guests, children: v })} 
        />
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <label className="group flex items-center justify-between p-4 bg-bg-soft rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
          <div>
            <h4 className="font-bold text-foreground text-sm">Is this an event?</h4>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">Birthday, Party, Offsite</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              checked={isEvent}
              onChange={(e) => setIsEvent(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${isEvent ? 'bg-foreground' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isEvent ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </label>
      </div>

      <div className="mt-8">
        <button 
          onClick={(e) => { e.stopPropagation(); onSearch?.(); }}
          className="w-full py-5 rounded-2xl glow-burst text-white font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center gap-3"
        >
          <Search className="w-4 h-4" strokeWidth={3} />
          Search
        </button>
      </div>
    </div>
  );
}
