import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RecentlyVisited from './components/RecentlyVisited';
import OffersSection from './components/OffersSection';
import BestRatedVillas from './components/BestRatedVillas';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <RecentlyVisited />
      <OffersSection />
      <BestRatedVillas />
    </main>
  );
}
