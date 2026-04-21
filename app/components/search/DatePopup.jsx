'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, startOfDay, isBefore } from 'date-fns';

export default function DatePopup({ startDate, endDate, setStartDate, setEndDate, flexibility, setFlexibility, onClose, onDateSelectionComplete }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderMonth = (month) => {
    const days = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    return (
      <div className="w-full">
        <h4 className="text-sm font-bold text-center mb-6">{format(month, 'MMMM yyyy')}</h4>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <span key={d} className="text-[10px] font-bold text-foreground/40 uppercase mb-2 tracking-widest">{d}</span>
          ))}
          {Array.from({ length: startOfMonth(month).getDay() }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => {
            const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
            const inRange = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
            const isPast = isBefore(startOfDay(day), startOfDay(new Date()));

            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  if (isPast) return;
                  if (!startDate || (startDate && endDate)) {
                    setStartDate(day);
                    setEndDate(null);
                  } else if (isBefore(day, startDate)) {
                    setStartDate(day);
                  } else {
                    setEndDate(day);
                    // Organic Flow: Auto-advance to Guests after selecting Check-out
                    setTimeout(() => {
                      onDateSelectionComplete?.();
                    }, 300);
                  }
                }}
                disabled={isPast}
                className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-full transition-all relative ${
                  isSelected ? 'bg-foreground text-white z-10' : ''
                } ${inRange && !isSelected ? 'bg-bg-soft' : ''} ${
                  isPast ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
              >
                {format(day, 'd')}
                {inRange && !isSelected && <div className="absolute inset-0 bg-bg-soft -z-10 rounded-none" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-full md:w-[850px] bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-6 md:p-8 z-[100] md:z-50 animate-fadeInUp overflow-y-auto">
      <div className="flex flex-col md:flex-row gap-12 relative">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="absolute left-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors z-20">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors z-20">
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex-1">{renderMonth(currentMonth)}</div>
        <div className="flex-1 hidden md:block">{renderMonth(addMonths(currentMonth, 1))}</div>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-center gap-3">
        {['Exact dates', '± 1 day', '± 2 days', '± 3 days', '± 7 days'].map(opt => (
          <button
            key={opt}
            onClick={() => setFlexibility(opt)}
            className={`px-6 py-2.5 rounded-full border text-xs font-bold transition-all ${
              flexibility === opt ? 'bg-foreground text-white border-foreground' : 'border-gray-200 hover:border-foreground'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
