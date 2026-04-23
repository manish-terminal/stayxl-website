'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LoyaltyContext = createContext(null);

export const TIERS = {
  BLUE: {
    name: 'Blue Member',
    discount: 10,
    minSpend: 0,
    minBookings: 0,
    pointValue: 5, // 1 point = ₹5
    color: '#3B82F6',
    perks: ['1x Complimentary BBQ', 'Joining Bonus: 150 Points', 'Member Only Pricing']
  },
  SILVER: {
    name: 'Silver Member',
    discount: 15,
    minSpend: 75000,
    minBookings: 3,
    pointValue: 7.5,
    color: '#94A3B8',
    perks: ['Free Early Check-in', '10% Off Food & Drinks', 'Priority Support'],
    nextTierHint: 'Unlock Gold for Room Upgrades & Late Checkout'
  },
  GOLD: {
    name: 'Gold Member',
    discount: 20,
    minSpend: 200000,
    minBookings: 10,
    pointValue: 10,
    color: '#C6A87D',
    perks: ['Complimentary Late Checkout', 'Free BBQ & Bonfire', 'Room Upgrades'],
    nextTierHint: 'You have reached the ultimate luxury tier'
  }
};

export function LoyaltyProvider({ children }) {
  const [loyaltyUser, setLoyaltyUser] = useState(null);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [scratchCardResult, setScratchCardResult] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('stayxl_loyalty_user');
    if (savedUser) {
      setLoyaltyUser(JSON.parse(savedUser));
    }
    const savedScratch = localStorage.getItem('stayxl_scratch_result');
    if (savedScratch) {
      setScratchCardResult(JSON.parse(savedScratch));
    }
  }, []);

  const loginMembership = useCallback((phone) => {
    const existingResult = localStorage.getItem('stayxl_scratch_result');
    
    const newUser = {
      phone,
      points: 150, // Updated joining bonus
      bookings: 0,
      tier: 'BLUE',
      name: 'Rohan Vats',
      currentSpend: 0,
      hasUsedScratchCard: !!existingResult,
    };
    setLoyaltyUser(newUser);
    localStorage.setItem('stayxl_loyalty_user', JSON.stringify(newUser));
  }, []);

  const claimScratchCard = useCallback((result) => {
    setScratchCardResult(result);
    localStorage.setItem('stayxl_scratch_result', JSON.stringify(result));
    
    setLoyaltyUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, hasUsedScratchCard: true };
      if (result.type === 'POINTS') {
        updated.points += result.value;
      }
      localStorage.setItem('stayxl_loyalty_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logoutMembership = useCallback(() => {
    setLoyaltyUser(null);
    setScratchCardResult(null);
    localStorage.removeItem('stayxl_loyalty_user');
    localStorage.removeItem('stayxl_scratch_result');
  }, []);

  return (
    <LoyaltyContext.Provider value={{ 
      loyaltyUser, 
      loginMembership, 
      logoutMembership,
      isMembershipModalOpen,
      setIsMembershipModalOpen,
      scratchCardResult,
      claimScratchCard,
      tiers: TIERS,
      // Helper to get current point value
      getPointValue: (tier) => TIERS[tier]?.pointValue || 5
    }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) throw new Error('useLoyalty must be used within LoyaltyProvider');
  return ctx;
}
