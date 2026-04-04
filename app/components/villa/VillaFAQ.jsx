'use client';

import { useState } from 'react';

export default function VillaFAQ({ faqData }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(Object.keys(faqData)[0]);

  if (!faqData || Object.keys(faqData).length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Categories */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-2xl font-serif font-medium text-[#072720] mb-6">FAQs</h2>
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {Object.keys(faqData).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-[#072720] text-white shadow-md'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="flex-1 space-y-3">
          {faqData[activeCategory]?.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl transition-all ${
                openIndex === index ? 'border-[#072720] bg-[#072720]/[0.02]' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="text-[15px] font-medium text-[#072720] pr-8">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-[#C09A59] transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
