'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/style.css';

export default function DateRangePicker({ onDateChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState();
  const calendarRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Format date as "31 Jan Sat 2026"
  const formatDate = (date) => {
    if (!date) return '';
    return format(date, 'd MMM EEE yyyy');
  };

  // Handle apply
  const handleApply = () => {
    if (range?.from && range?.to && onDateChange) {
      onDateChange({ checkIn: range.from, checkOut: range.to });
    }
    setIsOpen(false);
  };

  // Handle clear
  const handleClear = () => {
    setRange(undefined);
    if (onDateChange) {
      onDateChange({ checkIn: null, checkOut: null });
    }
  };

  return (
    <div className="relative w-full" ref={calendarRef}>
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-4">
        {/* Check-in Input */}
        <div>
          <label className="block text-xs font-medium text-[#072720]/60 mb-2">
            Check-in
          </label>
          <input
            type="text"
            readOnly
            value={formatDate(range?.from)}
            onClick={() => setIsOpen(true)}
            placeholder="Select date"
            className="w-full text-[#072720] text-base font-medium placeholder:text-[#072720]/40 focus:outline-none cursor-pointer"
          />
        </div>

        {/* Check-out Input */}
        <div>
          <label className="block text-xs font-medium text-[#072720]/60 mb-2">
            Check-out
          </label>
          <input
            type="text"
            readOnly
            value={formatDate(range?.to)}
            onClick={() => setIsOpen(true)}
            placeholder="Select date"
            className="w-full text-[#072720] text-base font-medium placeholder:text-[#072720]/40 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
            {/* Day Picker */}
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              disabled={{ before: new Date() }}
              className="rdp-custom"
            />

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
              <button
                type="button"
                onClick={handleClear}
                className="text-sm text-[#072720]/60 hover:text-[#072720] transition-colors"
              >
                Clear dates
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={!range?.from || !range?.to}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#072720] hover:bg-[#EFE7E7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
