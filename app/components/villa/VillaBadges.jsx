'use client';

import React from 'react';

export const BadgeIcon = ({ type }) => {
  switch (type.toLowerCase()) {
    case 'luxury stay':
      return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    case 'wedding friendly':
      return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      );
    case 'event friendly':
      return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        </svg>
      );
    case 'shoot friendly':
      return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
      );
    case 'stayxl luxury':
      return (
        <svg className="w-5 h-5 -mt-0.5" viewBox="0 0 200 200" fill="currentColor">
          <g>
            <path d="M128.436 49.548L99.856 7 71.355 49.414 29 21.748l10.793 110.99.033.326.237 2.442.056-.004c.182 1.279.396 2.47.647 3.588C48.159 172.345 70.134 193 98.116 193c.634 0 1.255-.044 1.884-.063.629.019 1.25.063 1.884.063 27.982 0 49.956-20.655 57.35-53.903.251-1.125.464-2.316.647-3.595l.056.004.237-2.442c.012-.109.023-.217.033-.326L171 21.744l-42.564 27.804zm-28.58-16.809l16.567 24.656-16.424 10.729-16.624-10.858 16.481-24.527zM56.059 99.82c-1.649 2.054-3.091 4.216-4.414 6.429l-2.337-24.023-3.124-32.108L63.349 61.33l12.02 7.851 11.507 7.516-17.07 11.151c-5.887 3.845-10.227 7.623-13.661 11.874-.026.033-.059.064-.086.098zm85.809 36.654a44.099 44.099 0 0 1-4.323 17.616c-4.467 9.304-11.637 16.319-20.429 20.425-5.208 2.432-10.984 3.831-17.116 4.071-5.944-.232-11.558-1.545-16.639-3.841-9.012-4.072-16.358-11.182-20.906-20.655a44.135 44.135 0 0 1-4.286-16.956c-.035-.712-.121-1.425-.121-2.136.002-9.404 3.122-18.612 9.211-26.198 2.468-3.076 5.774-5.918 10.403-8.942L100 85.268l22.338 14.59c4.629 3.024 7.935 5.865 10.403 8.938 6.089 7.589 9.209 16.797 9.211 26.202-.001.491-.067.984-.084 1.476zm8.786-53.849l-2.298 23.624c-1.324-2.215-2.766-4.378-4.415-6.433-.174-.217-.38-.419-.559-.633-3.362-4.027-7.555-7.656-13.188-11.336l-17.07-11.15 11.307-7.385 12.011-7.845 17.375-11.348-3.163 32.506z"></path>
          </g>
        </svg>
      );
    default:
      return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      );
  }
};

export default function VillaBadges({ tags = [] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 py-6">
      {tags.map((tag, i) => (
        <div 
          key={i} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 group"
        >
          <span className="text-[#C6A87D] group-hover:scale-110 transition-transform duration-300">
            <BadgeIcon type={tag} />
          </span>
          <span className="text-xs font-medium text-[#072720] tracking-wide whitespace-nowrap">
            {tag}
          </span>
        </div>
      ))}
    </div>
  );
}
