import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RecentlyVisited from './components/RecentlyVisited';
import OffersSection from './components/OffersSection';
import BestRatedVillas from './components/BestRatedVillas';
 
import TrustSection from './components/TrustSection';
import VillaShowcase from './components/VillaShowcase';
import EventsSection from './components/EventsSection';
import TrustedPartnersSection from './components/TrustedPartnersSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <RecentlyVisited />
      <OffersSection />
      <BestRatedVillas />
      <TrustSection />
      <VillaShowcase />
      <EventsSection />
      <TrustedPartnersSection />
      <Footer />
    </main>
  );
}
