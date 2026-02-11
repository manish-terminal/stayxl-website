'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ───── Villa Data ───── */
const villaCollection = [
  {
    name: 'The Ivory Manor',
    location: 'Kasauli, Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop',
    guests: 8,
    beds: 4,
    baths: 3,
    slug: 'the-ivory-manor',
  },
  {
    name: 'Villa del Sol',
    location: 'Alibaug, Maharashtra',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
    guests: 12,
    beds: 6,
    baths: 5,
    slug: 'villa-del-sol',
  },
  {
    name: 'The Grand Chateau',
    location: 'North Goa',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    guests: 16,
    beds: 8,
    baths: 6,
    slug: 'the-grand-chateau',
  },
  {
    name: 'Serenity Heights',
    location: 'Lonavala, Maharashtra',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop',
    guests: 6,
    beds: 3,
    baths: 2,
    slug: 'serenity-heights',
  },
  {
    name: 'Woodland Retreat',
    location: 'Coorg, Karnataka',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop',
    guests: 4,
    beds: 2,
    baths: 2,
    slug: 'woodland-retreat',
  },
  {
    name: 'Azure Bay Estate',
    location: 'Kochi, Kerala',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop',
    guests: 10,
    beds: 5,
    baths: 4,
    slug: 'azure-bay-estate',
  },
];

/* ───── Scroll Reveal Hook ───── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ───── Villa Card ───── */
function PriveCard({ villa, index }) {
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <Link
      href={`/villas/${villa.slug}`}
      ref={ref}
      className={`group block transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-lg shadow-black/10">
        <Image
          src={villa.image}
          alt={villa.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay (always) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

        {/* Hover overlay with specs */}
        <div className="absolute inset-0 bg-[#072720]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="flex items-center gap-5 text-white/90">
            <div className="text-center">
              <svg className="w-5 h-5 mx-auto mb-1 text-[#C09A59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <span className="text-xs font-medium">{villa.guests}</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-center">
              <svg className="w-5 h-5 mx-auto mb-1 text-[#C09A59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0l8.955 8.955M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
              </svg>
              <span className="text-xs font-medium">{villa.beds}</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-center">
              <svg className="w-5 h-5 mx-auto mb-1 text-[#C09A59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <span className="text-xs font-medium">{villa.baths}</span>
            </div>
          </div>
        </div>

        {/* Floating arrow CTA */}
        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#C09A59] flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </div>
      </div>

      {/* Card Info */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-serif font-medium text-white group-hover:text-[#C09A59] transition-colors duration-300">{villa.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <svg className="w-3.5 h-3.5 text-[#C09A59]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-white/40 tracking-wide">{villa.location}</span>
          </div>
        </div>
        <div className="mt-1 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/30 group-hover:border-[#C09A59] group-hover:text-[#C09A59] transition-all duration-300">
          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/* ───── Testimonials Data ───── */
const testimonials = [
  {
    quote: 'The Ivory Manor was nothing short of magical. Waking up to those valley views with a cup of chai on the balcony — it felt like time stood still. The concierge arranged a private bonfire and chef dinner that our family still talks about.',
    name: 'Priya & Arjun Sharma',
    villa: 'The Ivory Manor, Kasauli',
    date: 'January 2026',
  },
  {
    quote: 'We\'ve stayed at luxury resorts across Southeast Asia, but Villa del Sol surpassed them all. The infinity pool, the private beach access, and the level of personal attention — it was an experience, not just a stay.',
    name: 'Meera Kapoor',
    villa: 'Villa del Sol, Alibaug',
    date: 'December 2025',
  },
  {
    quote: 'Booked The Grand Chateau for my 40th birthday. 16 of us, a private chef, fairy lights in the garden, and the most incredible sunset I\'ve ever seen. StayXL Privé made every single detail perfect.',
    name: 'Vikram Singh',
    villa: 'The Grand Chateau, Goa',
    date: 'November 2025',
  },
  {
    quote: 'As a remote worker, I needed peace and reliable Wi-Fi. Woodland Retreat delivered both — plus a heated pool and the most serene coffee mornings surrounded by Coorg\'s misty hills.',
    name: 'Sneha Nair',
    villa: 'Woodland Retreat, Coorg',
    date: 'October 2025',
  },
  {
    quote: 'From the moment we arrived, the caretaker greeted us with warm towels and fresh juice. Every room was spotless, the pool was pristine, and the floating breakfast was Instagram-perfect. Pure luxury.',
    name: 'Rahul & Ananya Mehta',
    villa: 'Serenity Heights, Lonavala',
    date: 'September 2025',
  },
];

/* ───── Testimonials Carousel ───── */
function TestimonialsCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[active];

  return (
    <section className="py-20 md:py-28 bg-[#0a0a0a] relative overflow-hidden">
      {/* Decorative gold lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-[#C09A59]/40"></div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
        {/* Section label */}
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-10">
          Guest Stories
        </p>

        {/* Large gold quotation mark */}
        <div className="text-[#C09A59]/20 text-7xl md:text-8xl font-serif leading-none mb-4 select-none">&ldquo;</div>

        {/* Quote */}
        <div className="min-h-[120px] md:min-h-[100px] flex items-center justify-center">
          <p
            key={active}
            className="text-base md:text-lg lg:text-xl font-serif font-light text-white/80 leading-relaxed tracking-wide italic animate-fade-in"
          >
            {t.quote}
          </p>
        </div>

        {/* Guest info */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {/* Avatar initials */}
          <div className="w-11 h-11 rounded-full bg-[#C09A59]/15 border border-[#C09A59]/30 flex items-center justify-center">
            <span className="text-xs font-semibold text-[#C09A59] tracking-wider">
              {t.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{t.name}</p>
            <p className="text-[11px] text-white/30 mt-0.5">{t.villa} · {t.date}</p>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-400 rounded-full ${
                i === active
                  ? 'w-6 h-1.5 bg-[#C09A59]'
                  : 'w-1.5 h-1.5 bg-white/15 hover:bg-white/30'
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}

/* ───── Main Page ───── */
export default function PrivePage() {
  const [heroRef, heroVisible] = useScrollReveal(0.05);
  const [aboutRef, aboutVisible] = useScrollReveal(0.15);
  const [gridRef, gridVisible] = useScrollReveal(0.05);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* ═══════════════════════════════════════════
          1. FULLSCREEN HERO VIDEO BANNER
         ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>

        {/* Content */}
        <div className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-6 transition-all duration-1200 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Caption */}
          <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#C09A59] font-semibold mb-5">
            Bespoke Luxury Villa Experiences
          </p>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-white tracking-wide leading-tight mb-5 max-w-3xl">
            Finest Villas.
            <br />
            <span className="text-white/60">Unmatched Service.</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm md:text-base text-white/50 font-light max-w-lg mb-8 leading-relaxed">
            Handpicked luxury estates designed for unforgettable escapes.
          </p>

          {/* CTA */}
          <a
            href="#collection"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C09A59] text-white text-xs tracking-[0.2em] uppercase font-medium rounded-full hover:bg-white hover:text-[#072720] transition-all duration-400 hover:shadow-[0_0_30px_rgba(192,154,89,0.3)]"
          >
            Explore The Collection
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. ABOUT LUXURY EXPERIENCE
         ═══════════════════════════════════════════ */}
      <section ref={aboutRef} className="py-20 md:py-28 bg-[#072720]">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center transition-all duration-1000 ease-out ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Left — Image */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop"
                alt="Luxury villa living room"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
                loading="lazy"
              />
              {/* Decorative gold corner */}
              <div className="absolute top-0 left-0 w-20 h-20">
                <div className="absolute top-4 left-4 w-10 h-px bg-[#C09A59]"></div>
                <div className="absolute top-4 left-4 w-px h-10 bg-[#C09A59]"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20">
                <div className="absolute bottom-4 right-4 w-10 h-px bg-[#C09A59]"></div>
                <div className="absolute bottom-4 right-4 w-px h-10 bg-[#C09A59]"></div>
              </div>
            </div>

            {/* Right — Text */}
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">
                Bespoke Homes & Experiences
              </p>

              <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] font-serif font-light text-white tracking-wide leading-snug mb-6">
                Live The
                <br />
                <span className="text-white/30">Good Life.</span>
              </h2>

              <p className="text-sm text-white/50 leading-relaxed mb-5">
                At StayXL Privé, every estate is handpicked for its unique character, breathtaking location, and world-class amenities. Our dedicated concierge ensures every moment of your stay is curated to perfection — from private chef experiences to bespoke adventure itineraries.
              </p>

              <p className="text-sm text-white/50 leading-relaxed mb-8">
                Whether you&apos;re seeking a tranquil mountain retreat, a beachfront celebration, or a sprawling countryside escape, our collection offers only the finest homes across India&apos;s most coveted destinations.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8">
                {[
                  { value: '150+', label: 'Luxury Villas' },
                  { value: '20+', label: 'Destinations' },
                  { value: '10K+', label: 'Happy Guests' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-serif font-light text-[#C09A59]">{stat.value}</p>
                    <p className="text-[10px] tracking-wider uppercase text-white/40 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. VILLA COLLECTION GRID
         ═══════════════════════════════════════════ */}
      <section id="collection" ref={gridRef} className="py-16 md:py-24 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Section Header */}
          <div className={`text-center max-w-xl mx-auto mb-12 md:mb-16 transition-all duration-1000 ease-out ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">
              Our Collection
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-white tracking-wide leading-snug mb-4">
              Only The Finest Villas
              <br className="hidden md:block" />
              <span className="text-white/30"> in India</span>
            </h2>
            <p className="text-sm text-white/40 font-light">
              Each home in our collection is selected for its beauty, privacy, and uncompromising attention to detail.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {villaCollection.map((villa, i) => (
              <PriveCard key={i} villa={villa} index={i} />
            ))}
          </div>


        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. GUEST STORIES / TESTIMONIALS
         ═══════════════════════════════════════════ */}
      <TestimonialsCarousel />
      {/* ═══════════════════════════════════════════
          4. BOOK NOW CTA
         ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#072720] relative overflow-hidden">
        {/* Decorative gold line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-[#C09A59]"></div>

        <div className="max-w-2xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">
            Ready to Experience Luxury?
          </p>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-white tracking-wide leading-snug mb-4">
            Book Your
            <br />
            <span className="text-white/30">Private Escape</span>
          </h2>

          <p className="text-sm text-white/40 font-light mb-10 max-w-md mx-auto leading-relaxed">
            Our concierge team is available 24/7 to help you find the perfect villa and craft a bespoke experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Call CTA */}
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#C09A59] text-white text-xs tracking-[0.2em] uppercase font-medium rounded-full hover:bg-white hover:text-[#072720] transition-all duration-400 hover:shadow-[0_0_30px_rgba(192,154,89,0.25)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Call to Book
            </a>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20booking%20a%20Priv%C3%A9%20villa."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-green-500/30 bg-green-500/10 text-green-400 text-xs tracking-[0.2em] uppercase font-medium rounded-full hover:bg-green-500/20 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] transition-all duration-400"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp 24/7
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
