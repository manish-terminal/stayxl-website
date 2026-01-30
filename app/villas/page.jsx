import VillaCard from '../components/VillaCard';

export default function VillaCardsDemo() {
  // Dummy villa data
  const villas = [
    {
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      ],
      title: 'Lafu House Hearth | Serene Hills',
      location: 'Lafugathi, Shimla',
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 4468,
    },
    {
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      ],
      title: 'Mountain View Villa | Luxury Retreat',
      location: 'Manali, Himachal Pradesh',
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 6850,
    },
    {
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      ],
      title: 'Riverside Paradise | Peaceful Escape',
      location: 'Rishikesh, Uttarakhand',
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 3200,
    },
    {
      images: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80',
      ],
      title: 'Heritage Villa | Colonial Charm',
      location: 'Goa',
      guests: 10,
      bedrooms: 5,
      bathrooms: 4,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 8999,
    },
    {
      images: [
        'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
      ],
      title: 'Beachfront Bliss | Ocean Views',
      location: 'Alibaug, Maharashtra',
      guests: 6,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 5500,
    },
    {
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      ],
      title: 'Forest Hideaway | Nature Retreat',
      location: 'Coorg, Karnataka',
      guests: 5,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['Garden', 'Parking', 'Wifi'],
      price: 3800,
    },
  ];

  return (
    <div className="min-h-screen bg-[#EFE7E7]/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#072720] font-serif mb-2">
            Premium Villa Cards
          </h1>
          <p className="text-gray-600">
            Luxury villa listing cards with image sliders and elegant design
          </p>
        </div>
      </div>

      {/* Villa Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {villas.map((villa, index) => (
            <VillaCard key={index} {...villa} />
          ))}
        </div>
      </div>

      {/* Features List */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-[#072720] font-serif mb-6">
            Card Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Image slider with smooth transitions</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Pagination dots for navigation</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Hover effects with image zoom</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Card lift animation on hover</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Meta info with icons (guests, bedrooms, bathrooms)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Amenity chips with icons</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Premium typography and spacing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Fully responsive grid layout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
