'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (via cookie)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success) setUser(data.data.user);
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loginWithOtp = useCallback(async (phone, otp) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    setUser(data.data.user);
    return data.data;
  }, []);



  const sendOtp = useCallback(async (phone) => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }, []);

  const logout = useCallback(() => {
    document.cookie = 'token=; path=/; max-age=0';
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, loginWithOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
