'use client';

import { useState } from 'react';

const tabKeys = ['checkin', 'rules', 'deposit', 'meals', 'faqs', 'cancellation'];
const tabLabels = {
  checkin: 'Check-in / Check-out',
  rules: 'Villa Rules',
  deposit: 'Security Deposit',
  meals: 'Meals',
  faqs: 'FAQs',
  cancellation: 'Cancellation',
};

export default function PolicyTabs({ policies = {} }) {
  const [activeTab, setActiveTab] = useState('checkin');

  return (
    <div>
      <h2 className="text-lg font-serif font-medium text-[#072720] mb-5">Policies & Rules</h2>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-5 pb-0.5">
        {tabKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
              activeTab === key
                ? 'bg-[#072720] text-white'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tabLabels[key]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[120px]">
        {/* Check-in / Check-out */}
        {activeTab === 'checkin' && policies.checkIn && (
          <div className="space-y-3">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold">Check-in</p>
                <p className="text-sm font-medium text-[#072720] mt-1">{policies.checkIn.time}</p>
                <p className="text-xs text-gray-400 mt-0.5">{policies.checkIn.earlyCheckIn}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold">Check-out</p>
                <p className="text-sm font-medium text-[#072720] mt-1">{policies.checkOut.time}</p>
                <p className="text-xs text-gray-400 mt-0.5">{policies.checkOut.lateCheckOut}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3">{policies.checkIn.instructions}</p>
          </div>
        )}

        {/* Rules */}
        {activeTab === 'rules' && policies.rules && (
          <ul className="space-y-2">
            {policies.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#072720]/70">
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {rule}
              </li>
            ))}
          </ul>
        )}

        {/* Deposit */}
        {activeTab === 'deposit' && policies.deposit && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#072720]">₹{policies.deposit.amount.toLocaleString('en-IN')}</span>
              {policies.deposit.refundable && (
                <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Refundable</span>
              )}
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{policies.deposit.note}</p>
          </div>
        )}

        {/* Meals */}
        {activeTab === 'meals' && policies.meals && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#072720]">{policies.meals.included}</p>
            <ul className="space-y-1.5">
              {policies.meals.options.map((opt, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-[#C6A87D]">•</span>
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQs */}
        {activeTab === 'faqs' && policies.faqs && (
          <div className="space-y-3">
            {policies.faqs.map((faq, i) => (
              <div key={i} className="pb-3 border-b border-gray-50 last:border-0">
                <p className="text-sm font-medium text-[#072720] mb-1">{faq.q}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Cancellation */}
        {activeTab === 'cancellation' && policies.cancellation && (
          <div className="space-y-0">
            {policies.cancellation.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <span className="text-sm text-[#072720]/70">{item.period}</span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  item.refund === 'Full refund' ? 'bg-green-50 text-green-600' :
                  item.refund === 'No refund' ? 'bg-red-50 text-red-500' :
                  'bg-yellow-50 text-yellow-600'
                }`}>
                  {item.refund}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
