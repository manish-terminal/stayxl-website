'use client';

import { useState } from 'react';

export default function OfferCard({ offer }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 p-5">
      {/* Top Row: Tag and Type */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-[#EFE7E7] text-[#072720] text-xs font-medium rounded-full">
          offers
        </span>
        <span className="text-xs uppercase text-gray-500 font-medium tracking-wide">
          {offer.type}
        </span>
      </div>

      {/* Offer Description */}
      <p className="text-[#072720] font-semibold text-base mb-3 leading-relaxed">
        {offer.description}
      </p>

      {/* Terms & Conditions */}
      <button className="text-sm text-gray-500 hover:text-[#072720] hover:underline transition-colors mb-4">
        T&C's apply
      </button>

      {/* Coupon Code Row */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Coupon Code</p>
          <p className="text-lg font-bold text-[#072720] uppercase tracking-wide">
            {offer.code}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 border-2 rounded-md font-medium text-sm transition-all ${
            copied
              ? 'border-green-500 text-green-600 bg-green-50'
              : 'border-[#072720] text-[#072720] hover:bg-[#072720] hover:text-white'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Validity (Optional) */}
      {offer.validity && (
        <p className="text-xs text-gray-500 mt-3">
          Valid Till: {offer.validity}
        </p>
      )}
    </div>
  );
}
