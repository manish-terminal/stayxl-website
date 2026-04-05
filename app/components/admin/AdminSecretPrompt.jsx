'use client';

import { useState, useEffect } from 'react';

export default function AdminSecretPrompt({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedSecret = localStorage.getItem('stayxl_admin_key');
    if (savedSecret) {
      setIsAuthorized(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (secret.length < 4) {
      setError('Please enter a valid secret');
      return;
    }
    
    localStorage.setItem('stayxl_admin_key', secret);
    setIsAuthorized(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('stayxl_admin_key');
    setIsAuthorized(false);
    setSecret('');
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-zinc-400 mb-6">Please enter the admin passphrase to continue.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Admin Secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                autoFocus
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>
          
          <p className="text-zinc-500 text-xs mt-6 text-center">
            Tip: The default dev secret is in your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-[9998]">
        <button
          onClick={handleLogout}
          className="bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-xs border border-zinc-700 transition-all"
        >
          Lock Dashboard
        </button>
      </div>
      {children}
    </>
  );
}
