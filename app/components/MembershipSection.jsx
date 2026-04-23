'use client';

import { useState, useEffect, useRef } from 'react';
import { useLoyalty } from '../contexts/LoyaltyContext';
import { ChevronRight, Shield, Utensils, Gift, Sparkles, Coins, ArrowRight, Star, Percent } from 'lucide-react';

export default function MembershipSection() {
  const { loyaltyUser, loginMembership, scratchCardResult, claimScratchCard } = useLoyalty();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showRightScratch, setShowRightScratch] = useState(false);
  const [isRightScratching, setIsRightScratching] = useState(false);
  
  // Left Side Block Scratch State
  const [isLeftScratched, setIsLeftScratched] = useState(false);
  const [isLeftScratching, setIsLeftScratching] = useState(false);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      loginMembership(phoneNumber);
      setShowRightScratch(true);
    }
  };

  // Left Block Canvas Setup
  useEffect(() => {
    if (leftCanvasRef.current && !isLeftScratched) {
      const canvas = leftCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#C6A87D'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#B3956A';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
    }
  }, [isLeftScratched]);

  // Right Side Canvas Setup
  useEffect(() => {
    if (showRightScratch && rightCanvasRef.current && !scratchCardResult) {
      const canvas = rightCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#C6A87D'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#B3956A';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
    }
  }, [showRightScratch, scratchCardResult]);

  const scratchLeftBlock = () => {
    if (!leftCanvasRef.current || isLeftScratched || isLeftScratching) return;
    setIsLeftScratching(true);
    const canvas = leftCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let count = 0;
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI * 2); ctx.fill();
      }
      count++;
      if (count > 25) {
        clearInterval(interval);
        setIsLeftScratched(true);
        setIsLeftScratching(false);
      }
    }, 40);
  };

  const scratchRightSide = () => {
    if (!rightCanvasRef.current || scratchCardResult || isRightScratching) return;
    setIsRightScratching(true);
    const canvas = rightCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let count = 0;
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI * 2); ctx.fill();
      }
      count++;
      if (count > 35) {
        clearInterval(interval);
        const result = { type: 'BBQ', value: 1, label: 'Free BBQ on next Stay' };
        claimScratchCard(result);
        setTimeout(() => { window.location.href = '/membership'; }, 3000);
      }
    }, 40);
  };

  return (
    <section className="py-24 px-6 lg:px-10 bg-[#050505] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C6A87D]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Stunning Infographic */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#C6A87D] font-bold tracking-widest text-sm uppercase">
                <Sparkles className="w-4 h-4" />
                StayXL Reserve
              </div>
              <h2 className="text-5xl lg:text-7xl font-serif leading-tight">
                Your Points <br /> 
                <span className="text-[#C6A87D]">Shouldn't Go <br /> to Waste.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Join the most rewarding villa membership. Earn points on every booking, redeem them like cash, and unlock tiers with up to 20% flat discounts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-xl font-bold">1 Point = ₹5.00</h4>
                <p className="text-sm text-gray-500">Get <span className="text-white font-bold">150 Joining Points (₹750)</span> which you can redeem instantly on your first stay.</p>
              </div>

              {/* Mystery Gift Block - Redesigned to be space-efficient and immersive */}
              <div className="relative aspect-square md:aspect-auto md:h-[240px] rounded-3xl overflow-hidden border border-white/10 group cursor-pointer" onClick={scratchLeftBlock}>
                {/* Revealed State Background */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop" 
                    alt="Free BBQ" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* Content Overlay (Visible after scratching) */}
                <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end transition-opacity duration-500" style={{ opacity: isLeftScratched ? 1 : 0 }}>
                   <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mb-3 shadow-lg">
                      <Utensils className="w-5 h-5 text-white" />
                   </div>
                   <h4 className="text-2xl font-bold text-white leading-tight">FREE BBQ <br /> REVEALED</h4>
                   <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mt-1">Claim it on the right →</p>
                </div>

                {/* Scratch Layer */}
                {!isLeftScratched && (
                  <div className="absolute inset-0 z-20">
                    <canvas 
                      ref={leftCanvasRef} 
                      width={400} 
                      height={400} 
                      className="w-full h-full object-cover" 
                    />
                    
                    {/* Scratch Icon Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300" style={{ opacity: isLeftScratching ? 0 : 1 }}>
                       <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-pulse shadow-2xl">
                          <Gift className="w-8 h-8 text-[#C6A87D]" />
                       </div>
                       <span className="text-[10px] font-bold text-white uppercase tracking-widest mt-4 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                         {isLeftScratching ? 'Scratching...' : 'Tap to Scratch'}
                       </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
               <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs font-bold">
                     {String.fromCharCode(64 + i)}
                   </div>
                 ))}
               </div>
               <p className="text-sm text-gray-500">
                 <span className="text-white font-bold">12,000+ members</span> are already saving on their stays.
               </p>
            </div>
          </div>

          {/* Right Side: Action Box */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-[#C6A87D]/10 blur-3xl opacity-50" />
            
            <div className="relative bg-[#111] rounded-[2.5rem] p-8 lg:p-12 border border-white/10 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center">
              
              {!loyaltyUser ? (
                <div className="space-y-8 text-center lg:text-left animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C6A87D]/10 text-[#C6A87D] text-xs font-bold uppercase tracking-widest mb-4">
                    Claim Your Rewards
                  </div>
                  <h3 className="text-3xl font-serif font-medium">Ready to <br /> Start Saving?</h3>
                  <p className="text-gray-500">Enter your number to claim your 150 points and activate your revealed mystery gift.</p>
                  
                  <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto lg:mx-0">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Mobile Number"
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#C6A87D] transition-all"
                      required
                    />
                    <button
                      type="submit"
                      disabled={phoneNumber.length < 10}
                      className="w-full py-4 bg-[#C6A87D] text-black rounded-2xl font-bold tracking-wide hover:bg-[#D4B98E] transition-all flex items-center justify-center gap-2"
                    >
                      Redeem My Rewards
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              ) : showRightScratch && !scratchCardResult ? (
                <div className="text-center space-y-8 animate-fade-in">
                  <h3 className="text-2xl font-serif">Final Step: Scratch to Claim</h3>
                  
                  <div className="relative w-full max-w-[300px] aspect-[4/3] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C6A87D]/20">
                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-black">
                       <Utensils className="w-12 h-12 text-orange-500 mb-2" />
                       <span className="text-lg font-bold text-orange-600 uppercase">Free BBQ Activated</span>
                    </div>
                    <canvas ref={rightCanvasRef} width={300} height={225} className="absolute inset-0 z-10" />
                  </div>

                  <button 
                    onClick={scratchRightSide}
                    disabled={isRightScratching}
                    className="px-8 py-3 bg-[#C6A87D] text-black rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Gift className="w-5 h-5" />
                    {isRightScratching ? 'Claiming...' : 'Claim Now'}
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-8 animate-fade-in">
                   <div className="w-20 h-20 bg-orange-500/20 rounded-3xl flex items-center justify-center mx-auto text-orange-500 border border-orange-500/30">
                      <Utensils className="w-10 h-10" />
                   </div>
                   <h3 className="text-3xl font-serif text-white">Your Gift is Ready!</h3>
                   <p className="text-gray-400">Your Free BBQ and 150 points have been added to your Reserve account.</p>
                   <div className="flex justify-center gap-2">
                      <div className="w-2 h-2 bg-[#C6A87D] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#C6A87D] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-[#C6A87D] rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .glass-card {
          backdrop-filter: blur(10px);
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
