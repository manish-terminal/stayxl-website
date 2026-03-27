'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import HeroGallery from '../../components/villa/HeroGallery';
import VillaOverviewBar from '../../components/villa/VillaOverviewBar';
import BookingSidebar from '../../components/villa/BookingSidebar';
import OffersCarousel from '../../components/villa/OffersCarousel';
import VillaStory from '../../components/villa/VillaStory';
import BedroomAccordion from '../../components/villa/BedroomAccordion';
import AmenitiesGrid from '../../components/villa/AmenitiesGrid';
import SpacesSlider from '../../components/villa/SpacesSlider';
import ExperiencesSlider from '../../components/villa/ExperiencesSlider';
import LocationSection from '../../components/villa/LocationSection';
import PolicyTabs from '../../components/villa/PolicyTabs';
import ReviewsSection from '../../components/villa/ReviewsSection';
import SimilarVillasCarousel from '../../components/villa/SimilarVillasCarousel';
import SupportCTA from '../../components/villa/SupportCTA';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function VillaClientPage({ villa }) {
  if (!villa) {
    notFound();
  }

  // ─── Add-on state: [{ name, price, quantity }] ───
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [couponToApply, setCouponToApply] = useState('');

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      }
      return [...prev, { name: addon.name, price: addon.price, quantity: 1 }];
    });
  };

  // ─── Auto-select insurance for Samaya by default ───
  useEffect(() => {
    if (villa?.id === 'samaya' || villa?.slug?.includes('samaya')) {
      const insurance = villa.experiences?.find(e => e.name === 'Cancellation Insurance');
      if (insurance) {
        setSelectedAddons(prev => {
          if (!prev.find(a => a.name === insurance.name)) {
            return [...prev, { name: insurance.name, price: insurance.price, quantity: 1 }];
          }
          return prev;
        });
      }
    }
  }, [villa]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Gallery */}
      <div className="pt-16">
        <HeroGallery
          images={villa.images}
          name={villa.name}
          tagline={villa.tagline}
          rating={villa.rating}
          reviewCount={villa.reviewCount}
          location={villa.location}
          highlights={villa.highlights}
        />
      </div>

      {/* Content + Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <VillaOverviewBar
              guests={villa.guests}
              eventCapacity={villa.eventCapacity}
              bedrooms={villa.bedrooms}
              bathrooms={villa.bathrooms}
              area={villa.area}
              highlights={villa.highlights}
            />

            {/* Offers */}
            <div className="py-8 border-b border-gray-100">
              <OffersCarousel offers={villa.offers} onApply={(code) => setCouponToApply(code)} />
            </div>

            {/* Story */}
            <div className="py-8 border-b border-gray-100">
              <VillaStory story={villa.story} name={villa.name} />
            </div>

            {/* Bedrooms */}
            <div className="py-8 border-b border-gray-100">
              <BedroomAccordion bedroomDetails={villa.bedroomDetails} bathroomDetails={villa.bathroomDetails} />
            </div>

            {/* Amenities */}
            <div className="py-8 border-b border-gray-100">
              <AmenitiesGrid amenities={villa.amenities} />
            </div>

            {/* Spaces */}
            <div className="py-8 border-b border-gray-100">
              <SpacesSlider spaces={villa.spaces} />
            </div>

            {/* Experiences & Add-Ons */}
            <div className="py-8 border-b border-gray-100">
              <ExperiencesSlider
                experiences={villa.experiences}
                selectedAddons={selectedAddons}
                onToggle={toggleAddon}
              />
            </div>

            {/* Location */}
            <div className="py-8 border-b border-gray-100">
              <LocationSection locationInfo={villa.locationInfo} />
            </div>

            {/* Policies */}
            <div className="py-8 border-b border-gray-100">
              <PolicyTabs policies={villa.policies} rules={villa.rules} pricing={villa.pricing} />
            </div>

            {/* Reviews */}
            <div className="py-8">
              <ReviewsSection reviews={villa.reviews} rating={villa.rating} reviewCount={villa.reviewCount} />
            </div>
          </div>

          {/* Sidebar - Handles its own mobile vs desktop logic internally */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <BookingSidebar
              villaId={villa.id}
              villaSlug={villa.slug || 'the-ivory-manor'}
              pricePerNight={villa.pricePerNight}
              originalPrice={villa.originalPrice}
              maxGuests={villa.guests}
              selectedAddons={selectedAddons}
              experiences={villa.experiences}
              onToggleAddon={toggleAddon}
              applyCouponCode={couponToApply}
              pricing={villa.pricing}
            />
          </div>
        </div>
      </div>

      {/* Similar Villas */}
      <div className="bg-[#EFE7E7]/30 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <SimilarVillasCarousel villas={villa.similarVillas} />
        </div>
      </div>

      {/* Support CTA */}
      <SupportCTA />

      <Footer />
    </main>
  );
}
