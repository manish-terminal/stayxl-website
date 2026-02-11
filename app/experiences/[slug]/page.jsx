'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import experienceData from '../experienceData';

/* ───── Scroll Reveal ───── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ═══════════════════════════════════════════
   SECTION 1 — HERO BANNER
   ═══════════════════════════════════════════ */
function HeroBanner({ data }) {
  const [ref, vis] = useReveal(0.05);
  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {data.heroVideo ? (
        <video autoPlay muted loop playsInline poster={data.heroImage} className="absolute inset-0 w-full h-full object-cover">
          <source src={data.heroVideo} type="video/mp4" />
        </video>
      ) : (
        <Image src={data.heroImage} alt={data.heading} fill className="object-cover" priority />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      <div className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#C09A59] font-semibold mb-5">{data.caption}</p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-white tracking-wide leading-tight mb-5 max-w-3xl">{data.heading}</h1>
        <p className="text-sm md:text-base text-white/50 font-light max-w-lg mb-8 leading-relaxed">{data.subtext}</p>
        <a href="#intro" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C09A59] text-white text-xs tracking-[0.2em] uppercase font-medium rounded-full hover:bg-white hover:text-[#072720] transition-all duration-400 hover:shadow-[0_0_30px_rgba(192,154,89,0.3)]">
          Explore Experience
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
        </a>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/60 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 2 — INTRO STORY
   ═══════════════════════════════════════════ */
function IntroStory({ intro }) {
  const [ref, vis] = useReveal();
  return (
    <section id="intro" ref={ref} className="py-20 md:py-28 bg-[#072720]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center transition-all duration-1000 ease-out ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <Image src={intro.image} alt={intro.heading} fill sizes="(max-width:768px)100vw,45vw" className="object-cover" loading="lazy" />
            <div className="absolute top-0 left-0 w-20 h-20"><div className="absolute top-4 left-4 w-10 h-px bg-[#C09A59]" /><div className="absolute top-4 left-4 w-px h-10 bg-[#C09A59]" /></div>
            <div className="absolute bottom-0 right-0 w-20 h-20"><div className="absolute bottom-4 right-4 w-10 h-px bg-[#C09A59]" /><div className="absolute bottom-4 right-4 w-px h-10 bg-[#C09A59]" /></div>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">The Experience</p>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white tracking-wide leading-snug mb-6">{intro.heading}</h2>
            <p className="text-sm text-white/50 leading-relaxed mb-6">{intro.description}</p>
            <ul className="space-y-2.5">
              {intro.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-white/60">
                  <span className="w-1 h-1 rounded-full bg-[#C09A59] flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 3 — WHY CHOOSE
   ═══════════════════════════════════════════ */
function WhyChoose({ features }) {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">Why Choose Us</p>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-white tracking-wide">What Makes It <span className="text-white/30">Special</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className={`bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm rounded-2xl p-6 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#C09A59]/5 transition-all duration-500 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 4 — CURATED VILLAS
   ═══════════════════════════════════════════ */
function CuratedVillas({ villas }) {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">Curated Properties</p>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-white tracking-wide">Perfect Villas <span className="text-white/30">for This Experience</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {villas.map((v, i) => (
            <Link key={i} href={`/villas/${v.slug}`} className={`group block transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-lg">
                <Image src={v.image} alt={v.name} fill sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-[#072720]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="flex items-center gap-5 text-white/90 text-xs font-medium">
                    <span>👥 {v.guests}</span>
                    <span className="w-px h-4 bg-white/20" />
                    <span>🛏️ {v.beds}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#C09A59] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                </div>
              </div>
              <h3 className="text-base font-serif font-medium text-white group-hover:text-[#C09A59] transition-colors">{v.name}</h3>
              <p className="text-xs text-white/40 mt-1">{v.location}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 5 — SERVICES / ADD-ONS
   ═══════════════════════════════════════════ */
function ServicesSlider({ services }) {
  const scrollRef = useRef(null);
  const scroll = (d) => scrollRef.current?.scrollBy({ left: d === 'left' ? -280 : 280, behavior: 'smooth' });
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#072720]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className={`flex items-center justify-between mb-10 transition-all duration-1000 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-2">Add-On Services</p>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-white tracking-wide">Enhance <span className="text-white/30">Your Experience</span></h2>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:border-[#C09A59] hover:text-[#C09A59] transition-colors" aria-label="Previous"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:border-[#C09A59] hover:text-[#C09A59] transition-colors" aria-label="Next"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-1" style={{ scrollSnapType: 'x mandatory' }}>
          {services.map((s, i) => (
            <div key={i} className="flex-shrink-0 w-[240px] bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-400" style={{ scrollSnapAlign: 'start' }}>
              <div className="text-2xl mb-3">{s.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{s.name}</h3>
              <p className="text-[11px] text-white/40 leading-relaxed mb-3">{s.description}</p>
              {s.price && <span className="text-xs font-medium text-[#C09A59]">{s.price}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 6 — TIMELINE / FLOW
   ═══════════════════════════════════════════ */
function TimelineFlow({ timeline }) {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className={`text-center mb-14 transition-all duration-1000 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">How It Works</p>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-white tracking-wide">From Enquiry <span className="text-white/30">to Experience</span></h2>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#C09A59]/60 via-[#C09A59]/20 to-transparent" />
          <div className="space-y-10">
            {timeline.map((t, i) => (
              <div key={i} className={`flex gap-5 md:gap-8 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 200}ms` }}>
                <div className="relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#C09A59]/10 border border-[#C09A59]/30 flex items-center justify-center">
                  <span className="text-sm font-serif font-medium text-[#C09A59]">{t.step}</span>
                </div>
                <div className="pt-1">
                  <h3 className="text-sm font-semibold text-white mb-1">{t.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 7 — GALLERY
   ═══════════════════════════════════════════ */
function GallerySection({ gallery }) {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className={`text-center mb-10 transition-all duration-1000 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">Gallery</p>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-white tracking-wide">A Glimpse <span className="text-white/30">of the Experience</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {gallery.slice(0, 6).map((img, i) => (
            <div key={i} className={`relative overflow-hidden rounded-xl group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'} transition-all duration-700 ${vis ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <Image src={img} alt={`Gallery ${i + 1}`} fill sizes={i === 0 ? '66vw' : '33vw'} className="object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 8 — TESTIMONIALS
   ═══════════════════════════════════════════ */
function TestimonialsSection({ testimonials }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);
  const t = testimonials[active];
  return (
    <section className="py-20 md:py-28 bg-[#072720] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-[#C09A59]/40" />
      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-10">Guest Stories</p>
        <div className="text-[#C09A59]/20 text-7xl md:text-8xl font-serif leading-none mb-4 select-none">&ldquo;</div>
        <div className="min-h-[100px] flex items-center justify-center">
          <p key={active} className="text-base md:text-lg lg:text-xl font-serif font-light text-white/80 leading-relaxed tracking-wide italic" style={{ animation: 'fadeIn 0.6s ease-out' }}>{t.quote}</p>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="w-11 h-11 rounded-full bg-[#C09A59]/15 border border-[#C09A59]/30 flex items-center justify-center">
            <span className="text-xs font-semibold text-[#C09A59]">{t.name.split(' ').slice(0, 2).map(n => n[0]).join('')}</span>
          </div>
          <p className="text-sm font-medium text-white">{t.name}</p>
          <p className="text-[11px] text-white/30">{t.type}</p>
        </div>
        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`transition-all duration-400 rounded-full ${i === active ? 'w-6 h-1.5 bg-[#C09A59]' : 'w-1.5 h-1.5 bg-white/15 hover:bg-white/30'}`} aria-label={`Testimonial ${i + 1}`} />
          ))}
        </div>
      </div>
      <style jsx>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 9 — FAQ
   ═══════════════════════════════════════════ */
function FaqSection({ faqs }) {
  const [open, setOpen] = useState(0);
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">Have Questions?</p>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-white tracking-wide">Frequently Asked <span className="text-white/30">Questions</span></h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/[0.06] rounded-xl overflow-hidden transition-colors hover:border-white/[0.1]">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="text-sm font-medium text-white/80 pr-4">{faq.q}</span>
                <svg className={`w-4 h-4 text-[#C09A59] flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-5 pb-5 text-xs text-white/40 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 10 — CONVERSION CTA
   ═══════════════════════════════════════════ */
function ConversionCTA({ headline, subtext }) {
  return (
    <section className="py-16 md:py-24 bg-[#072720] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-[#C09A59]" />
      <div className="max-w-2xl mx-auto px-6 md:px-8 text-center">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">Ready to Begin?</p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-white tracking-wide leading-snug mb-4">{headline}</h2>
        <p className="text-sm text-white/40 font-light mb-10 max-w-md mx-auto leading-relaxed">{subtext}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="tel:+919876543210" className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#C09A59] text-white text-xs tracking-[0.2em] uppercase font-medium rounded-full hover:bg-white hover:text-[#072720] transition-all duration-400 hover:shadow-[0_0_30px_rgba(192,154,89,0.25)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            Call to Book
          </a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-green-500/30 bg-green-500/10 text-green-400 text-xs tracking-[0.2em] uppercase font-medium rounded-full hover:bg-green-500/20 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] transition-all duration-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            WhatsApp 24/7
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function ExperiencePage() {
  const { slug } = useParams();
  const data = experienceData[slug];

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-2xl font-serif text-white mb-2">Experience Not Found</h1>
          <p className="text-sm text-white/40 mb-6">The experience you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="text-sm text-[#C09A59] hover:underline">← Back to Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <HeroBanner data={data} />
      <IntroStory intro={data.intro} />
      <WhyChoose features={data.features} />
      <CuratedVillas villas={data.villas} />
      <ServicesSlider services={data.services} />
      <TimelineFlow timeline={data.timeline} />
      <GallerySection gallery={data.gallery} />
      <TestimonialsSection testimonials={data.testimonials} />
      <FaqSection faqs={data.faqs} />
      <ConversionCTA headline={data.ctaHeadline} subtext={data.ctaSubtext} />
      <Footer />
    </main>
  );
}
