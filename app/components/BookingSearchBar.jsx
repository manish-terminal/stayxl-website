'use client';

import { useState } from 'react';
import DateRangePicker from './DateRangePicker';

export default function BookingSearchBar() {
  const [formData, setFormData] = useState({
    location: '',
    checkIn: null,
    checkOut: null,
    guests: '2',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', formData);
    // Handle search logic here
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = ({ checkIn, checkOut }) => {
    setFormData({
      ...formData,
      checkIn,
      checkOut,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 -mb-16 md:-mb-20 relative z-20">
      {/* Main Search Card */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 overflow-visible">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Location Input */}
            <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="block text-xs font-medium text-[#072720]/60 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where to?"
                className="w-full text-[#072720] text-base font-medium placeholder:text-[#072720]/40 focus:outline-none"
              />
            </div>

            {/* Date Range Picker */}
            <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <DateRangePicker onDateChange={handleDateChange} />
            </div>

            {/* Guests */}
            <div className="p-4 md:p-6 flex items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-[#072720]/60 mb-2">
                  Guests
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full text-[#072720] text-base font-medium focus:outline-none cursor-pointer"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6+ Guests</option>
                </select>
              </div>

              {/* Search Button - Mobile */}
              <div className="md:hidden ml-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#072720] text-white font-semibold text-base rounded-lg hover:bg-[#072720]/90 transition-colors duration-300 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Search Button - Desktop */}
          <div className="hidden md:block p-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-[#072720] text-white font-semibold text-lg rounded-lg hover:bg-[#072720]/90 transition-colors duration-300 py-4 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Info Strip Below Search Bar */}
      {/* <div className="bg-[#EFE7E7] rounded-b-xl md:rounded-b-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 mt-0">
        <p className="text-[#072720]/80 text-sm md:text-base text-center md:text-left">
          Finding your ideal vacation spot should be easy, we're here to help!
        </p>
        <button className="text-[#072720] font-medium text-sm md:text-base hover:underline transition-all whitespace-nowrap">
          Request Callback →
        </button>
      </div> */}
    </div>
  );
}
