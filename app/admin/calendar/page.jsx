'use client';

import { useState, useEffect, useMemo } from 'react';
import { villas as staticVillas } from '../../data/villas';

export default function AdminCalendarPage() {
  const [selectedVilla, setSelectedVilla] = useState(staticVillas[0]?.id || '');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(null); // { start, end }
  const [blockReason, setBlockReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const villaName = staticVillas.find(v => v.id === selectedVilla)?.name || '';

  // Fetch blocked + booked dates
  useEffect(() => {
    if (!selectedVilla) return;
    fetchDates();
  }, [selectedVilla]);

  const fetchDates = async () => {
    setLoading(true);
    try {
      const villaSlug = staticVillas.find(v => v.id === selectedVilla)?.slug;
      // Fetch unavailable dates (blocked + booked) from the public endpoint
      const res = await fetch(`/api/villas/${villaSlug}/unavailable-dates`);
      if (res.ok) {
        const data = await res.json();
        setUnavailableDates(data?.data || []);
      }
      // Fetch admin-only blocked dates list
      const adminRes = await fetch(`/api/admin/block-dates?villaId=${selectedVilla}`);
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        setBlockedDates(adminData?.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch dates', e);
    }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calendar generation
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

  // Determine date status
  const getDateStatus = (dateStr) => {
    if (!dateStr) return 'empty';
    for (const entry of unavailableDates) {
      if (dateStr >= entry.startDate && dateStr <= entry.endDate) {
        return entry.reason === 'blocked' ? 'blocked' : 'booked';
      }
    }
    return 'available';
  };

  // Check if date is in the active selection range
  const isInSelection = (dateStr) => {
    if (!selecting || !selecting.start) return false;
    const end = selecting.end || selecting.start;
    const [s, e] = selecting.start <= end ? [selecting.start, end] : [end, selecting.start];
    return dateStr >= s && dateStr <= e;
  };

  // Date click handler
  const handleDateClick = (dateStr) => {
    if (!selecting) {
      setSelecting({ start: dateStr, end: null });
    } else if (!selecting.end) {
      const end = dateStr;
      const [s, e] = selecting.start <= end ? [selecting.start, end] : [end, selecting.start];
      setSelecting({ start: s, end: e });
      setShowModal(true);
    }
  };

  const handleDateHover = (dateStr) => {
    if (selecting && !selecting.end) {
      setSelecting(prev => ({ ...prev, end: dateStr }));
    }
  };

  // Block dates
  const handleBlockDates = async () => {
    if (!selecting?.start || !selecting?.end) return;
    try {
      const res = await fetch('/api/admin/block-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villaId: selectedVilla,
          startDate: selecting.start,
          endDate: selecting.end,
          reason: blockReason || 'Admin blocked',
        }),
      });
      if (res.ok) {
        showToast(`Blocked ${selecting.start} → ${selecting.end}`);
        fetchDates();
      } else {
        showToast('Failed to block dates', 'error');
      }
    } catch (e) {
      showToast('Network error', 'error');
    }
    setSelecting(null);
    setBlockReason('');
    setShowModal(false);
  };

  // Unblock
  const handleUnblock = async (id) => {
    try {
      const res = await fetch(`/api/admin/block-dates?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Dates unblocked');
        fetchDates();
      }
    } catch (e) {
      showToast('Failed to unblock', 'error');
    }
  };

  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all ${
          toast.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Date Blocking</h1>
          <p className="text-white/50 mt-1">Block dates to prevent bookings for any villa</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
              ←
            </button>
            <span className="text-lg font-semibold text-white">{monthName}</span>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
              →
            </button>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500/50"></span> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/50"></span> Blocked</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500/50"></span> Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#C6A87D]/30 border border-[#C6A87D]/50"></span> Selecting</span>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-white/30 py-2">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, i) => {
              if (!cell) return <div key={`empty-${i}`} className="aspect-square" />;
              const status = getDateStatus(cell.date);
              const selected = isInSelection(cell.date);
              const isPast = cell.date < new Date().toISOString().split('T')[0];

              let bgClass = 'bg-white/[0.03] hover:bg-white/[0.08]';
              if (status === 'blocked') bgClass = 'bg-red-500/20 border-red-500/40';
              else if (status === 'booked') bgClass = 'bg-amber-500/20 border-amber-500/40';
              if (selected) bgClass = 'bg-[#C6A87D]/25 border-[#C6A87D]/60 ring-1 ring-[#C6A87D]/30';
              if (isPast) bgClass += ' opacity-40';

              return (
                <button
                  key={cell.date}
                  onClick={() => !isPast && handleDateClick(cell.date)}
                  onMouseEnter={() => !isPast && handleDateHover(cell.date)}
                  disabled={isPast}
                  className={`aspect-square rounded-lg border border-white/5 flex flex-col items-center justify-center text-sm transition-all cursor-pointer ${bgClass}`}
                >
                  <span className={`font-medium ${status === 'blocked' ? 'text-red-400' : status === 'booked' ? 'text-amber-400' : 'text-white/80'}`}>
                    {cell.day}
                  </span>
                  {status === 'blocked' && <span className="text-[8px] text-red-400/70 mt-0.5">BLOCKED</span>}
                  {status === 'booked' && <span className="text-[8px] text-amber-400/70 mt-0.5">BOOKED</span>}
                </button>
              );
            })}
          </div>

          {selecting && !showModal && (
            <p className="text-center text-[#C6A87D] text-sm mt-4 animate-pulse">
              Click another date to complete the range selection...
            </p>
          )}
        </div>

        {/* Sidebar — Blocked Dates List */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Blocked Dates for {villaName}</h3>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : blockedDates.length === 0 ? (
            <p className="text-white/40 text-sm">No dates blocked for this villa.</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {blockedDates.map((bd) => (
                <div key={bd.id} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 group hover:border-red-500/40 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-300">
                        {bd.startDate?.split('T')[0]} → {bd.endDate?.split('T')[0]}
                      </p>
                      {bd.reason && <p className="text-xs text-white/40 mt-1">{bd.reason}</p>}
                    </div>
                    <button
                      onClick={() => handleUnblock(bd.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs bg-white/5 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Unblock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Block Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Block Dates</h3>
            <p className="text-white/50 text-sm mb-6">
              {selecting?.start} → {selecting?.end} for <span className="text-[#C6A87D]">{villaName}</span>
            </p>
            <label className="block text-sm text-white/60 mb-2">Reason (optional)</label>
            <input
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. Holiday Maintenance, Owner Stay"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C6A87D] mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowModal(false); setSelecting(null); }}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-white/60 bg-white/5 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockDates}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-black bg-red-500 hover:bg-red-400 transition-all"
              >
                🚫 Block These Dates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
