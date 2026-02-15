'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import experienceData from './experienceData';

/* ───── Scroll Reveal Hook ───── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

const experiences = Object.values(experienceData);

export default function ExperiencesPage() {
  const [heroRef, heroVis] = useReveal(0.05);
  const [cardsRef, cardsVis] = useReveal(0.08);
  const [ctaRef, ctaVis] = useReveal(0.1);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden"
      >
        {/* Background Collage */}
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
          {experiences.map((exp, i) => (
            <div key={exp.slug} className="relative overflow-hidden">
              <Image
                src={exp.heroImage}
                alt={exp.caption}
                fill
                className="object-cover"
                sizes="(max-width:768px)50vw,25vw"
                priority={i < 2}
              />
            </div>
          ))}
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[#072720]/30" />

        {/* Content */}
        <div
          className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${
            heroVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#C09A59] font-semibold mb-5">
            Curated Experiences
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-white tracking-wide leading-tight mb-5 max-w-3xl">
            Extraordinary Moments,{' '}
            <span className="text-white/30">Unforgettable Stays</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 font-light max-w-lg mb-8 leading-relaxed">
            From dream weddings to soul-restoring retreats — discover experiences
            designed for life&apos;s most meaningful moments.
          </p>
          <a
            href="#experiences"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C09A59] text-white text-xs tracking-[0.2em] uppercase font-medium rounded-full hover:bg-white hover:text-[#072720] transition-all duration-400 hover:shadow-[0_0_30px_rgba(192,154,89,0.3)]"
          >
            Explore All
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ═══ EXPERIENCE CARDS ═══ */}
      <section id="experiences" ref={cardsRef} className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div
            className={`text-center mb-14 transition-all duration-1000 ${
              cardsVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">
              Choose Your Experience
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-white tracking-wide">
              Every Moment Deserves{' '}
              <span className="text-white/30">to Be Extraordinary</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {experiences.map((exp, i) => (
              <Link
                key={exp.slug}
                href={`/experiences/${exp.slug}`}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-700 ${
                  cardsVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden">
                  <Image
                    src={exp.heroImage}
                    alt={exp.heading}
                    fill
                    sizes="(max-width:768px)100vw,50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#072720]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Caption badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] tracking-[0.2em] uppercase text-white/80 font-semibold">
                      {exp.caption}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#C09A59] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500 shadow-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl md:text-2xl font-serif font-light text-white tracking-wide mb-2 group-hover:text-[#C09A59] transition-colors duration-500">
                      {exp.heading}
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed max-w-md mb-3">
                      {exp.subtext}
                    </p>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-2">
                      {exp.features.slice(0, 3).map((f, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] text-white/60"
                        >
                          <span>{f.icon}</span>
                          {f.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-12 bg-[#072720] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Events Hosted' },
              { value: '50+', label: 'Premium Villas' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '24/7', label: 'Concierge Support' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl md:text-3xl font-serif font-light text-[#C09A59] mb-1">
                  {stat.value}
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">
              Simple Process
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-white tracking-wide">
              How It{' '}
              <span className="text-white/30">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose an Experience',
                description: 'Browse our curated collection of luxury experiences — from intimate weddings to rejuvenating wellness retreats.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Customize Everything',
                description: 'Our dedicated team tailors every detail — venue, décor, dining, activities — to perfectly match your vision.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Live the Moment',
                description: 'Arrive at your stunning villa and let us handle every detail. Your only job is to enjoy the experience.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-[#C09A59]/10 border border-[#C09A59]/20 flex items-center justify-center mx-auto mb-5 text-[#C09A59]">
                  {item.icon}
                </div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#C09A59]/60 font-semibold">
                  Step {item.step}
                </span>
                <h3 className="text-sm font-semibold text-white mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section ref={ctaRef} className="py-20 md:py-28 bg-[#072720] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-[#C09A59]" />
        <div
          className={`max-w-2xl mx-auto px-6 md:px-8 text-center transition-all duration-1000 ${
            ctaVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#C09A59] font-semibold mb-4">
            Let&apos;s Create Something Special
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-white tracking-wide leading-snug mb-4">
            Have a Custom Experience in Mind?
          </h2>
          <p className="text-sm text-white/40 font-light mb-10 max-w-md mx-auto leading-relaxed">
            Our experience specialists are ready to bring your vision to life.
            Tell us what you dream of and we&apos;ll make it happen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#C09A59] text-white text-xs tracking-[0.2em] uppercase font-medium rounded-full hover:bg-white hover:text-[#072720] transition-all duration-400 hover:shadow-[0_0_30px_rgba(192,154,89,0.25)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Speak With Us
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-green-500/30 bg-green-500/10 text-green-400 text-xs tracking-[0.2em] uppercase font-medium rounded-full hover:bg-green-500/20 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] transition-all duration-400"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
