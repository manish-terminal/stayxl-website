'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className={`text-2xl lg:text-3xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}>
            StayXL
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          {['Home', 'Privé', 'Experiences', 'Contact'].map((item) => (
            <Link 
              key={item} 
              href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className={`text-sm font-medium tracking-wide hover:opacity-70 transition ${isScrolled ? 'text-foreground' : 'text-white'}`}
            >
              {item}
            </Link>
          ))}
          <button className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
            isScrolled ? 'bg-foreground text-white hover:bg-foreground/90' : 'bg-white text-foreground hover:bg-gray-100'
          }`}>
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
}
