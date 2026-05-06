'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/calendar', label: '📅 Date Blocking', icon: '📅' },
    { href: '/admin/pricing', label: '💰 Pricing', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Admin Top Bar */}
      <header className="border-b border-white/10 bg-[#111] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#C6A87D] font-bold text-xl tracking-tight">
              StayXL
            </Link>
            <span className="text-xs bg-[#C6A87D]/20 text-[#C6A87D] px-2 py-0.5 rounded-full font-medium">
              ADMIN
            </span>
          </div>
          <nav className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-[#C6A87D] text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
