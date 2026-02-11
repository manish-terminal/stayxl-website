import villaData from '../../components/villa/villaData';
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

export default function VillaDetailPage() {
  const villa = villaData;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Gallery */}
      <div className="pt-16">
        <HeroGallery
          images={villa.images}
          name={villa.name}
          rating={villa.rating}
          reviewCount={villa.reviewCount}
          location={villa.location}
          highlights={villa.highlights}
        />
      </div>

      {/* Content + Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="flex gap-10">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <VillaOverviewBar
              guests={villa.guests}
              bedrooms={villa.bedrooms}
              bathrooms={villa.bathrooms}
              area={villa.area}
              highlights={villa.highlights}
            />

            {/* Offers */}
            <div className="py-8 border-b border-gray-100">
              <OffersCarousel offers={villa.offers} />
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

            {/* Experiences */}
            <div className="py-8 border-b border-gray-100">
              <ExperiencesSlider experiences={villa.experiences} />
            </div>

            {/* Location */}
            <div className="py-8 border-b border-gray-100">
              <LocationSection locationInfo={villa.locationInfo} />
            </div>

            {/* Policies */}
            <div className="py-8 border-b border-gray-100">
              <PolicyTabs policies={villa.policies} />
            </div>

            {/* Reviews */}
            <div className="py-8">
              <ReviewsSection reviews={villa.reviews} rating={villa.rating} reviewCount={villa.reviewCount} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-[380px] flex-shrink-0">
            <BookingSidebar
              pricePerNight={villa.pricePerNight}
              originalPrice={villa.originalPrice}
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

      {/* Mobile Booking Bar */}
      <div className="lg:hidden">
        <BookingSidebar pricePerNight={villa.pricePerNight} originalPrice={villa.originalPrice} />
      </div>

      <Footer />
    </main>
  );
}
