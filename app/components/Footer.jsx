'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

/* ───── Data Arrays ───── */

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const exploreLinks = [
  { label: 'Home', href: '/' },
  { label: 'Villas', href: '/villas' },
  { label: 'Destinations', href: '#' },
  { label: 'Offers', href: '#' },
  { label: 'Experiences', href: '#' },
  { label: 'Events & Retreats', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const supportLinks = [
  { label: 'FAQs', href: '#' },
  { label: 'Booking Policy', href: '#' },
  { label: 'Cancellation Policy', href: '#' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Customer Support', href: '#' },
];

const paymentMethods = ['Visa', 'MC', 'UPI', 'GPay', 'Rzp'];

/* ───── Sub-Components ───── */

function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-xs tracking-[0.25em] uppercase text-white/40 font-semibold mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="text-sm text-white/50 hover:text-white transition-colors duration-300 relative group/link inline-block"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white/30 group-hover/link:w-full transition-all duration-300"></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <p className="text-xs tracking-[0.2em] uppercase text-white/40 font-semibold mb-4">
        Stay Updated With Exclusive Offers
      </p>
      <div className={`flex rounded-full overflow-hidden border transition-all duration-300 ${isFocused ? 'border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'border-white/10'}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter your email"
          className="flex-1 bg-white/5 text-white text-sm px-5 py-3 placeholder:text-white/20 outline-none min-w-0"
          aria-label="Email address"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-white/10 text-white text-xs tracking-widest uppercase font-medium hover:bg-white/20 transition-all duration-300 flex-shrink-0"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}

/* ───── Main Footer ───── */

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`bg-[#072720] transition-opacity duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-14 md:pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Col 1: Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            {/* Brand Name */}
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-serif font-light text-white tracking-wide">
                StayXL
              </span>
            </Link>

            <p className="text-sm text-white/35 leading-relaxed mb-6 max-w-[280px]">
              Curated luxury villas crafted for unforgettable stays, private escapes, and premium experiences.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Explore Links */}
          <FooterLinkColumn title="Explore" links={exploreLinks} />

          {/* Col 3: Support Links */}
          <FooterLinkColumn title="Support" links={supportLinks} />

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase text-white/40 font-semibold mb-5">
              Get In Touch
            </h4>

            <div className="space-y-3.5">
              {/* Phone */}
              <div className="flex items-center gap-3 text-white/50">
                <svg className="w-4 h-4 flex-shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-sm">+91 98765 43210</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 text-white/50">
                <svg className="w-4 h-4 flex-shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="text-sm">hello@elivaas.com</span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 text-white/50">
                <svg className="w-4 h-4 flex-shrink-0 text-white/30 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-sm leading-relaxed">Gurugram, Haryana,<br />India 122001</span>
              </div>

            </div>
          </div>

        </div>

        {/* Newsletter */}
        <div className="mt-12 md:mt-14 pt-8 border-t border-white/[0.06]">
          <div className="max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </div>



      {/* Copyright Strip */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/20 tracking-wider">
              © 2026 Elivaas Villas. All Rights Reserved.
            </p>
            <div className="flex items-center gap-5">
              {['Privacy Policy', 'Terms', 'Sitemap'].map((link, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-[11px] text-white/20 tracking-wider hover:text-white/40 transition-colors duration-300"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
