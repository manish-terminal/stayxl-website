'use client';

import { useState, useEffect, useMemo } from 'react';
import { villas as staticVillas } from '../../data/villas';
import { apiFetch } from '@/app/lib/api';
import AdminSecretPrompt from '@/app/components/admin/AdminSecretPrompt';

export default function AdminPricingPage() {
  const [selectedVilla, setSelectedVilla] = useState(staticVillas[0]?.id || '');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [pricingOverrides, setPricingOverrides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState('');
  const [modalPrice, setModalPrice] = useState('');
  const [modalReason, setModalReason] = useState('');
  const [editBasePrice, setEditBasePrice] = useState(false);
  const [newBasePrice, setNewBasePrice] = useState('');
  const [dynamicBasePrice, setDynamicBasePrice] = useState(0);
  const [toast, setToast] = useState(null);

  const villa = staticVillas.find(v => v.id === selectedVilla);
  const villaName = villa?.name || '';
  
  // Initialize dynamicBasePrice whenever selectedVilla changes
  useEffect(() => {
    if (villa) {
      setDynamicBasePrice(villa.pricePerNight || 0);
    }
  }, [villa]);

  useEffect(() => {
    if (!selectedVilla) return;
    fetchPricing();
  }, [selectedVilla]);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/admin/pricing?villaId=${selectedVilla}`);
      setPricingOverrides(data?.data || []);
    } catch (e) {
      console.error('Failed to fetch pricing', e);
    }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calendar
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, date: dateStr });
    }
    return days;
  }, [currentMonth]);

  const getOverrideForDate = (dateStr) => {
    return pricingOverrides.find(p => p.date === dateStr);
  };

  const handleDateClick = (dateStr) => {
    const existing = getOverrideForDate(dateStr);
    setModalDate(dateStr);
    setModalPrice(existing ? String(existing.price) : '');
    setModalReason(existing ? existing.reason : '');
    setShowModal(true);
  };

  const handleSetPrice = async () => {
    if (!modalPrice || Number(modalPrice) <= 0) return;
    try {
      await apiFetch('/api/admin/pricing', {
        method: 'POST',
        body: JSON.stringify({
          villaId: selectedVilla,
          date: modalDate,
          price: Number(modalPrice),
          reason: modalReason || '',
        }),
      });
      showToast(`Set ₹${Number(modalPrice).toLocaleString()} for ${modalDate}`);
      fetchPricing();
    } catch (e) {
      showToast(e.message || 'Failed to set price', 'error');
    }
    setShowModal(false);
    setModalPrice('');
    setModalReason('');
  };

  const handleDeleteOverride = async (id) => {
    try {
      await apiFetch(`/api/admin/pricing?id=${id}`, { method: 'DELETE' });
      showToast('Override removed');
      fetchPricing();
    } catch (e) {
      showToast(e.message || 'Failed to remove', 'error');
    }
  };

  const handleUpdateBasePrice = async () => {
    if (!newBasePrice || Number(newBasePrice) <= 0) return;
    try {
      await apiFetch(`/api/admin/villas/${selectedVilla}/price`, {
        method: 'PUT',
        body: JSON.stringify({ price: Number(newBasePrice) }),
      });
      
      // Update local state so UI reflects the change immediately
      setDynamicBasePrice(Number(newBasePrice));
      
      showToast(`Base price updated to ₹${Number(newBasePrice).toLocaleString()}`);
      setEditBasePrice(false);
    } catch (e) {
      showToast(e.message || 'Failed to update', 'error');
    }
  };

  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const formatPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <AdminSecretPrompt>
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-2xl ${
            toast.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'
          }`}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">Admin Pricing</h1>
            <p className="text-white/50 mt-1">Set date-specific price overrides for any villa</p>
          </div>
          <select
            value={selectedVilla}
            onChange={(e) => setSelectedVilla(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C6A87D] transition-colors w-full md:w-64"
          >
            {staticVillas.map((v) => (
              <option key={v.id} value={v.id} className="bg-[#1a1a1a]">{v.name} — {v.location}</option>
            ))}
          </select>
        </div>

        {/* Base Price Card */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Base Price per Night</p>
              {editBasePrice ? (
                <div className="flex items-center gap-3">
                  <input
                    value={newBasePrice}
                    onChange={(e) => setNewBasePrice(e.target.value)}
                    type="number"
                    placeholder={String(basePrice)}
                    className="bg-white/5 border border-[#C6A87D]/50 rounded-lg px-3 py-2 text-white text-xl font-bold w-40 focus:outline-none"
                  />
                  <button onClick={handleUpdateBasePrice} className="px-4 py-2 bg-[#C6A87D] text-black rounded-lg text-sm font-bold hover:bg-[#b89a6f] transition-all">Save</button>
                  <button onClick={() => setEditBasePrice(false)} className="px-4 py-2 bg-white/5 text-white/60 rounded-lg text-sm hover:bg-white/10 transition-all">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-[#C6A87D]">{formatPrice(dynamicBasePrice)}</span>
                  <button onClick={() => { setEditBasePrice(true); setNewBasePrice(String(dynamicBasePrice)); }}
                    className="text-xs text-white/40 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all">
                    ✏️ Edit
                  </button>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs text-right">Active Overrides</p>
              <p className="text-2xl font-bold text-white">{pricingOverrides.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pricing Calendar */}
          <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">←</button>
              <span className="text-lg font-semibold text-white">{monthName}</span>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">→</button>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-white/5 border border-white/10"></span> Base Price</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#C6A87D]/25 border border-[#C6A87D]/50"></span> Custom Price</span>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-white/30 py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((cell, i) => {
                if (!cell) return <div key={`empty-${i}`} className="aspect-square" />;
                const override = getOverrideForDate(cell.date);
                const isPast = cell.date < new Date().toISOString().split('T')[0];
                const price = override ? override.price : dynamicBasePrice;

                return (
                  <button
                    key={cell.date}
                    onClick={() => !isPast && handleDateClick(cell.date)}
                    disabled={isPast}
                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-xs transition-all cursor-pointer ${
                      override
                        ? 'bg-[#C6A87D]/15 border-[#C6A87D]/40 hover:bg-[#C6A87D]/25'
                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08]'
                    } ${isPast ? 'opacity-40' : ''}`}
                  >
                    <span className={`font-semibold text-sm ${override ? 'text-[#C6A87D]' : 'text-white/70'}`}>{cell.day}</span>
                    <span className={`text-[9px] mt-0.5 ${override ? 'text-[#C6A87D]/80 font-semibold' : 'text-white/30'}`}>
                      {formatPrice(price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar — Overrides Table */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Price Overrides</h3>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
              </div>
            ) : pricingOverrides.length === 0 ? (
              <p className="text-white/40 text-sm">No custom prices set.<br/>Click a date on the calendar to add one.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {pricingOverrides
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((p) => (
                  <div key={p.id} className="bg-[#C6A87D]/10 border border-[#C6A87D]/20 rounded-xl p-4 group hover:border-[#C6A87D]/40 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#C6A87D]">{p.date}</p>
                        <p className="text-lg font-bold text-white mt-0.5">{formatPrice(p.price)}</p>
                        {p.reason && <p className="text-xs text-white/40 mt-1">{p.reason}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteOverride(p.id)}
                        className="opacity-0 group-hover:opacity-100 text-xs bg-white/5 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Set Price Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Set Price Override</h3>
              <p className="text-white/50 text-sm mb-6">
                <span className="text-[#C6A87D]">{modalDate}</span> for <span className="text-[#C6A87D]">{villaName}</span>
              </p>

              <label className="block text-sm text-white/60 mb-2">Price per Night (₹)</label>
              <input
                value={modalPrice}
                onChange={(e) => setModalPrice(e.target.value)}
                type="number"
                placeholder={String(dynamicBasePrice)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-[#C6A87D] mb-4"
              />

              <label className="block text-sm text-white/60 mb-2">Reason (optional)</label>
              <input
                value={modalReason}
                onChange={(e) => setModalReason(e.target.value)}
                placeholder="e.g. Weekend, Diwali, Off-season"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C6A87D] mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-white/60 bg-white/5 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetPrice}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-black bg-[#C6A87D] hover:bg-[#b89a6f] transition-all"
                >
                  💰 Set Price
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSecretPrompt>
  );
}
