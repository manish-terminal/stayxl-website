import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section - to demonstrate navbar overlay and scroll effect */}
      <section className="relative h-screen bg-gradient-to-br from-[#072720] via-[#0a3d33] to-[#072720] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-wide">
            Luxury Villa Escapes
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light mb-8 tracking-wide">
            Experience unparalleled elegance in the world's most exclusive destinations
          </p>
          <button className="px-8 py-4 bg-white text-[#072720] rounded-full text-lg font-light tracking-wide hover:bg-[#EFE7E7] transition-all duration-300 shadow-xl">
            Explore Our Collection
          </button>
        </div>
      </section>

      {/* Content Section - to demonstrate scroll behavior */}
      <section className="bg-[#EFE7E7] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-[#072720] mb-8 text-center">
            Curated Luxury Experiences
          </h2>
          <p className="text-lg text-[#072720]/80 text-center max-w-3xl mx-auto leading-relaxed">
            Scroll down to see the navbar transform from transparent to solid background with smooth animations.
            Our collection of handpicked villas offers the perfect blend of comfort, style, and sophistication.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-[#EFE7E7] rounded-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#072720] rounded-full mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-serif">{item}</span>
              </div>
              <h3 className="text-2xl font-serif text-[#072720] mb-4">
                Premium Feature
              </h3>
              <p className="text-[#072720]/70 leading-relaxed">
                Experience world-class amenities and personalized service in every property we offer.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#072720] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">
            Ready to Book Your Dream Villa?
          </h2>
          <button className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-light tracking-wide hover:bg-white hover:text-[#072720] transition-all duration-300">
            Get Started Today
          </button>
        </div>
      </section>
    </main>
  );
}
