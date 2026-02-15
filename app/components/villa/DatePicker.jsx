'use client';

import { useState, useEffect, useRef } from 'react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date, start, end) {
  if (!start || !end) return false;
  return date > start && date < end;
}

export default function DatePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  unavailableDates = new Set(),
  minDate,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minD = minDate ? parseDate(minDate) : (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(0, 0, 0, 0); return d; })();
  const checkInDate = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);

  // Which phase: selecting check-in or check-out
  const [selectingCheckOut, setSelectingCheckOut] = useState(!!checkIn && !checkOut);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = checkInDate || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const containerRef = useRef(null);

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const goBack = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goForward = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Can't go before current month
  const canGoBack = currentMonth > new Date(today.getFullYear(), today.getMonth(), 1);

  const handleDayClick = (date) => {
    const dateStr = toDateStr(date);

    if (!selectingCheckOut || !checkIn) {
      // Selecting check-in
      onCheckInChange(dateStr);
      onCheckOutChange('');
      setSelectingCheckOut(true);
    } else {
      // Selecting check-out
      if (date <= checkInDate) {
        // If user clicks before check-in, reset to new check-in
        onCheckInChange(dateStr);
        onCheckOutChange('');
        setSelectingCheckOut(true);
      } else {
        // Check if any unavailable date falls in the range
        const hasBlockedInRange = hasUnavailableInRange(checkInDate, date);
        if (hasBlockedInRange) {
          // Reset — can't book across blocked dates
          onCheckInChange(dateStr);
          onCheckOutChange('');
          setSelectingCheckOut(true);
        } else {
          onCheckOutChange(dateStr);
          setSelectingCheckOut(false);
        }
      }
    }
  };

  const hasUnavailableInRange = (start, end) => {
    if (!start || !end) return false;
    const current = new Date(start);
    current.setDate(current.getDate() + 1);
    while (current < end) {
      if (unavailableDates.has(toDateStr(current))) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

  const renderMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = toDateStr(date);
      const isPast = date < minD;
      const isUnavailable = unavailableDates.has(dateStr);
      const isDisabled = isPast || isUnavailable;
      const isCheckIn = isSameDay(date, checkInDate);
      const isCheckOut = isSameDay(date, checkOutDate);
      const isSelected = isCheckIn || isCheckOut;
      const inRange = isInRange(date, checkInDate, checkOutDate);
      const isToday = isSameDay(date, today);

      cells.push(
        <button
          key={day}
          disabled={isDisabled}
          onClick={() => handleDayClick(date)}
          className={`
            relative w-full aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-150
            ${isDisabled
              ? 'text-gray-200 cursor-not-allowed'
              : isSelected
                ? 'bg-[#072720] text-white shadow-sm z-10'
                : inRange
                  ? 'bg-[#072720]/8 text-[#072720]'
                  : 'text-gray-700 hover:bg-[#072720]/5 hover:text-[#072720]'
            }
            ${isUnavailable && !isPast ? 'line-through decoration-gray-300' : ''}
            ${isToday && !isSelected ? 'ring-1 ring-[#C09A59] ring-inset' : ''}
          `}
          title={isUnavailable ? 'Not available' : isPast ? 'Past date' : ''}
        >
          {day}
        </button>
      );
    }

    return (
      <div>
        <h3 className="text-sm font-semibold text-[#072720] text-center mb-3">
          {MONTHS[month]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {cells}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef}>
      {/* Selection Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setSelectingCheckOut(false)}
          className={`flex-1 text-left px-3 py-2.5 rounded-xl border-2 transition-all ${
            !selectingCheckOut
              ? 'border-[#072720] bg-[#072720]/5'
              : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Check-in</p>
          <p className={`text-sm font-medium ${checkIn ? 'text-[#072720]' : 'text-gray-300'}`}>
            {checkIn ? new Date(checkIn + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Select'}
          </p>
        </button>
        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <button
          onClick={() => checkIn && setSelectingCheckOut(true)}
          className={`flex-1 text-left px-3 py-2.5 rounded-xl border-2 transition-all ${
            selectingCheckOut
              ? 'border-[#072720] bg-[#072720]/5'
              : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Check-out</p>
          <p className={`text-sm font-medium ${checkOut ? 'text-[#072720]' : 'text-gray-300'}`}>
            {checkOut ? new Date(checkOut + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Select'}
          </p>
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#072720] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goForward}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#072720] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Two-Month Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {renderMonth(currentMonth)}
        {renderMonth(nextMonth)}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#072720]" />
          <span className="text-[10px] text-gray-400">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#072720]/10" />
          <span className="text-[10px] text-gray-400">Your stay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-gray-300" /></div>
          </div>
          <span className="text-[10px] text-gray-400">Unavailable</span>
        </div>
      </div>

      {/* Selecting hint */}
      <p className="text-center text-[11px] text-gray-400 mt-2">
        {selectingCheckOut
          ? checkIn ? '← Select your check-out date' : '← Select your check-in date'
          : checkIn && checkOut
            ? `${Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))} night stay selected`
            : '← Select your check-in date'
        }
      </p>
    </div>
  );
}
