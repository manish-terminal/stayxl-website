'use client';

import { useLoyalty, TIERS } from '../contexts/LoyaltyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  User, 
  Briefcase, 
  Wallet, 
  Award, 
  LogOut, 
  TrendingUp, 
  Gift, 
  ChevronRight,
  Zap,
  Clock,
  Utensils,
  ChevronDown,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

export default function MembershipPage() {
  const { loyaltyUser, logoutMembership, scratchCardResult, tiers, pointValue } = useLoyalty();
  const [activeTab, setActiveTab] = useState('loyalty');
  const [expandedTier, setExpandedTier] = useState(loyaltyUser?.tier || 'BLUE');

  if (!loyaltyUser) {
    return (
      <main className="min-h-screen bg-[#FBFBFB]">
        <Navbar />
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif mb-6 text-gray-900">StayXL Reserve</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Experience luxury like never before. Join our elite circle to unlock member-only villas, personal concierge services, and curated experiences.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-gray-900 text-white rounded-full font-bold shadow-2xl hover:bg-black transition-all"
          >
            Enter the Reserve
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const currentTierData = tiers[loyaltyUser.tier];
  const walletValue = (loyaltyUser.points * pointValue).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  // Calculate next tier logic
  const tierKeys = Object.keys(tiers);
  const currentIndex = tierKeys.indexOf(loyaltyUser.tier);
  const nextTierKey = tierKeys[currentIndex + 1];
  const nextTierData = nextTierKey ? tiers[nextTierKey] : null;

  const bookingsNeeded = nextTierData ? Math.max(0, nextTierData.minBookings - loyaltyUser.bookings) : 0;

  const sidebarItems = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: Briefcase },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'loyalty', label: 'Loyalty Membership', icon: Award },
  ];

  return (
    <main className="min-h-screen bg-[#FBFBFB]">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-100 border border-gray-100 sticky top-32">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-4xl font-bold text-[#C6A87D] mb-4 border border-gray-100 shadow-inner">
                  {loyaltyUser.name.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-3 h-3 text-[#C6A87D] fill-[#C6A87D]" />
                    <span className="text-[10px] font-bold text-[#C6A87D] uppercase tracking-[0.2em]">
                      {currentTierData.name}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{loyaltyUser.name}</h2>
                </div>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                      activeTab === item.id 
                        ? 'bg-[#C6A87D]/10 text-[#C6A87D] font-bold' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#C6A87D]' : 'text-gray-400 group-hover:text-gray-900'}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <button 
                  onClick={logoutMembership}
                  className="w-full flex items-center gap-3 p-4 text-gray-400 font-medium hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Log Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1 space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-serif font-medium text-gray-900 mb-2">Reserve Dashboard</h1>
                <p className="text-gray-500">Welcome to your exclusive member area, {loyaltyUser.name.split(' ')[0]}.</p>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-gray-100 text-center min-w-[150px]">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">StayXLCash</span>
                    <span className="text-2xl font-bold text-gray-900">{loyaltyUser.points.toLocaleString()}</span>
                    <span className="text-[10px] text-rose-500 font-bold block mt-1">≈ {walletValue}</span>
                 </div>
              </div>
            </header>

            {/* Current Perks & Active Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <CheckCircle2 className="w-24 h-24 text-green-500" />
                  </div>
                  <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#C6A87D] fill-[#C6A87D]" />
                    Current Active Perks
                  </h4>
                  <ul className="space-y-4">
                     {currentTierData.perks.map((perk, i) => (
                       <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          {perk}
                       </li>
                     ))}
                  </ul>
               </div>

               {scratchCardResult && (
                 <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Gift className="w-24 h-24 text-[#C6A87D]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#C6A87D] uppercase tracking-widest bg-[#C6A87D]/10 px-3 py-1 rounded-full mb-4 inline-block">
                      Mystery Win
                    </span>
                    <h4 className="text-2xl font-serif mb-2">Claimed Perk</h4>
                    <p className="text-gray-400 text-sm mb-6">You revealed <span className="text-white font-bold">{scratchCardResult.label}</span> during joining.</p>
                    <button className="px-6 py-2.5 bg-[#C6A87D] text-black rounded-xl font-bold text-sm hover:bg-[#D4B98E] transition-all">
                       Redeem Now
                    </button>
                 </div>
               )}
            </div>

            {/* Progression & Milestone Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                   <div>
                      <h3 className="text-2xl font-bold mb-2">Your Milestone</h3>
                      <p className="text-gray-500">Every stay brings you closer to the next tier of luxury.</p>
                   </div>
                   {nextTierData && (
                     <div className="bg-[#C6A87D]/10 px-6 py-4 rounded-3xl border border-[#C6A87D]/20 text-center">
                        <span className="text-[10px] font-bold text-[#C6A87D] uppercase tracking-widest block mb-1">Upcoming Perk Hint</span>
                        <p className="text-sm font-bold text-gray-900">{nextTierData.nextTierHint}</p>
                     </div>
                   )}
                </div>

                <div className="space-y-10">
                   <div className="relative pt-4">
                      {/* Booking Counter Visual */}
                      <div className="flex justify-between items-center mb-8">
                         <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#C6A87D] text-white flex items-center justify-center font-bold shadow-lg shadow-[#C6A87D]/30">
                               {loyaltyUser.bookings}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Bookings Done</span>
                         </div>
                         <div className="flex-1 mx-8 relative">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-[#C6A87D] transition-all duration-1000" 
                                 style={{ width: nextTierData ? `${(loyaltyUser.bookings / nextTierData.minBookings) * 100}%` : '100%' }} 
                               />
                            </div>
                            {nextTierData && (
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-gray-200"
                                style={{ left: `${(loyaltyUser.bookings / nextTierData.minBookings) * 100}%` }}
                              />
                            )}
                         </div>
                         <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 text-gray-300 flex items-center justify-center font-bold">
                               {nextTierData?.minBookings || '✓'}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Next Target</span>
                         </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                               <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-gray-900 font-bold">
                                 {nextTierData ? (
                                   <>Only <span className="text-blue-600">{bookingsNeeded} more booking{bookingsNeeded > 1 ? 's' : ''}</span> to reach {nextTierData.name}</>
                                 ) : (
                                   "You've achieved the highest tier!"
                                 )}
                               </p>
                               <p className="text-xs text-gray-500">Reach the target to unlock 15-20% discounts automatically.</p>
                            </div>
                         </div>
                         <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg">
                            Plan Next Stay
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Tier Benefits Accordion */}
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-medium mb-6">Tier Details & Perks</h3>
              {Object.entries(tiers).map(([key, tier]) => (
                <div 
                  key={key} 
                  className={`bg-white rounded-[2rem] border transition-all overflow-hidden ${
                    expandedTier === key ? 'border-[#C6A87D]/30 shadow-xl' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <button 
                    onClick={() => setExpandedTier(expandedTier === key ? null : key)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${
                        loyaltyUser.tier === key ? 'bg-[#C6A87D] text-white' : 'bg-gray-50 text-gray-400'
                      }`}>
                        {tier.discount}%
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{tier.name}</h4>
                        <p className="text-sm text-gray-500">Required: {tier.minBookings} Bookings or ₹{tier.minSpend.toLocaleString()} spend</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${expandedTier === key ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedTier === key && (
                    <div className="px-8 pb-8 animate-fade-in">
                      <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tier.perks.map((perk, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl group/perk">
                             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover/perk:scale-110 transition-all">
                               {perk.includes('BBQ') ? <Utensils className="w-4 h-4 text-orange-500" /> : 
                                perk.includes('Bonus') ? <Wallet className="w-4 h-4 text-yellow-500" /> : 
                                <Zap className="w-4 h-4 text-blue-500" />}
                             </div>
                             <span className="text-sm font-medium text-gray-700">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      <Footer />

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
