'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import LocationPopup from './LocationPopup';
import DatePopup from './DatePopup';
import GuestPopup from './GuestPopup';
import { format } from 'date-fns';

export default function StayXLSearchBar() {
  const [activePopup, setActivePopup] = useState(null); // 'where', 'when', 'who'
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [flexibility, setFlexibility] = useState('Exact dates');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [isEvent, setIsEvent] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await import('../../data/locations.json');
        setLocations(data.locations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure background scroll is unset
  useEffect(() => {
    document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [activePopup]);

  const togglePopup = (popup) => {
    setActivePopup(activePopup === popup ? null : popup);
    
    // Auto-scroll to "correct view" with Navbar offset
    if (activePopup !== popup) {
      setTimeout(() => {
        const element = containerRef.current;
        if (element) {
          const offset = 100; // Account for fixed Navbar + some breathing room
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleSearch = () => {
    const searchData = {
      location: selectedLocation?.name || 'Anywhere',
      dates: {
        start: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        end: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        flexibility
      },
      guests: guests.adults + guests.children,
      guestDetails: guests,
      isEvent
    };
    
    console.log("🔍 Triggering Search with data:", searchData);
    
    // Auto-scroll to results
    const resultsSection = document.getElementById('villa-grid');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setActivePopup(null);
  };

  return (
    <div ref={containerRef} className="relative z-40 -mt-10 md:-mt-14 px-4 md:px-10">
      {/* The Search Bar Pill */}
      <div className={`mx-auto max-w-6xl bg-white rounded-full shadow-[0_15px_45px_-10px_rgba(0,0,0,0.12)] p-1.5 md:p-2.5 border border-gray-100 transition-all duration-300 ${activePopup ? 'md:bg-gray-50' : ''}`}>
        
        {/* Mobile Slim Strip View */}
        <div className="flex md:hidden items-center justify-between px-5 py-3 cursor-pointer" onClick={() => togglePopup('where')}>
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-accent" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground">Where to?</span>
              <div className="flex items-center gap-1.5 text-[9px] text-text-muted font-bold tracking-tight whitespace-nowrap overflow-hidden">
                <span className="uppercase tracking-wider">{selectedLocation?.name || 'Anywhere'}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{startDate ? format(startDate, 'MMM d') : 'Any week'}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{guests.adults + guests.children} Guests</span>
              </div>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex flex-row items-center relative">
          
          {/* WHERE */}
          <button 
            onClick={() => togglePopup('where')}
            className={`flex-[1.2] px-8 py-4 text-left rounded-l-full transition-all group ${
              activePopup === 'where' ? 'bg-white shadow-md z-10' : 'hover:bg-white/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className={`w-4 h-4 ${activePopup === 'where' ? 'text-accent' : 'text-foreground/20'}`} />
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-[0.25em] mb-1">Where</label>
                <p className={`text-sm font-semibold truncate ${selectedLocation ? 'text-foreground' : 'text-foreground/25'}`}>
                  {selectedLocation ? selectedLocation.name : "Search destinations"}
                </p>
              </div>
            </div>
          </button>

          {/* WHEN */}
          <button 
            onClick={() => togglePopup('when')}
            className={`flex-[1.5] px-8 py-4 text-left border-x border-gray-100 transition-all group ${
              activePopup === 'when' ? 'bg-white shadow-md z-10' : 'hover:bg-white/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className={`w-4 h-4 ${activePopup === 'when' ? 'text-accent' : 'text-foreground/20'}`} />
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-[0.25em] mb-1">When</label>
                <p className={`text-sm font-semibold truncate ${startDate ? 'text-foreground' : 'text-foreground/25'}`}>
                  {startDate ? `${format(startDate, 'MMM d')} ${endDate ? `- ${format(endDate, 'MMM d')}` : ''}` : "Add dates"}
                </p>
              </div>
            </div>
          </button>

          {/* WHO */}
          <button 
            onClick={() => togglePopup('who')}
            className={`flex-1 px-8 py-4 text-left transition-all group ${
              activePopup === 'who' ? 'bg-white shadow-md z-10' : 'hover:bg-white/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-4 h-4 ${activePopup === 'who' ? 'text-accent' : 'text-foreground/20'}`} />
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-[0.25em] mb-1">Who</label>
                <p className={`text-sm font-semibold truncate ${(guests.adults + guests.children) > 1 ? 'text-foreground' : 'text-foreground/25'}`}>
                  {(guests.adults + guests.children)} Guests {isEvent ? "• Event" : ""}
                </p>
              </div>
            </div>
          </button>

          {/* Search Button */}
          <div className="pr-1.5">
            <button 
              onClick={(e) => { e.stopPropagation(); handleSearch(); }}
              className="h-14 px-10 md:px-12 bg-foreground text-white rounded-full font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-foreground/90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 group"
            >
              <Search className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={2.5} />
              <span className="hidden lg:block">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Popups - Rendered as siblings to avoid button nesting issues */}
      <div onClick={(e) => e.stopPropagation()}>
        {activePopup === 'where' && (
          <LocationPopup 
            locations={locations} 
            onSelect={(loc) => { setSelectedLocation(loc); setActivePopup('when'); }}
            selectedLocation={selectedLocation}
            onClose={() => setActivePopup(null)}
          />
        )}
        {activePopup === 'when' && (
          <DatePopup 
            startDate={startDate} 
            endDate={endDate} 
            setStartDate={setStartDate} 
            setEndDate={setEndDate}
            flexibility={flexibility}
            setFlexibility={setFlexibility}
            onClose={() => setActivePopup(null)}
            onDateSelectionComplete={() => setActivePopup('who')}
          />
        )}
        {activePopup === 'who' && (
          <GuestPopup 
            guests={guests} 
            setGuests={setGuests}
            isEvent={isEvent}
            setIsEvent={setIsEvent}
            onClose={() => setActivePopup(null)}
            onSearch={handleSearch}
          />
        )}
      </div>
    </div>
  );
}
