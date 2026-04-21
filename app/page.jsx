import Navbar from './components/Navbar';
import StayVistaHero from './components/StayVistaHero';
import StayXLSearchBar from './components/search/StayXLSearchBar';
import StayVistaCollections from './components/StayVistaCollections';
import AestheticStories from './components/AestheticStories';
import ClassyVillaGrid from './components/ClassyVillaGrid';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <StayVistaHero />
      <StayXLSearchBar />
      <StayVistaCollections />
      <AestheticStories />
      <div className="bg-white">
        <ClassyVillaGrid />
      </div>
      <Footer />
    </main>
  );
}
