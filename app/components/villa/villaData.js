// Sample villa data for the detail page
const villaData = {
    slug: 'the-ivory-manor',
    name: 'The Ivory Manor',
    tagline: 'A Serene Hilltop Retreat With Panoramic Valley Views',
    location: 'Kasauli, Himachal Pradesh',
    rating: 4.9,
    reviewCount: 127,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    area: '3,200 sq ft',
    pricePerNight: 18500,
    originalPrice: 24000,
    highlights: ['Private Pool', 'Mountain View', 'Pet Friendly', 'Fireplace'],

    images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
    ],

    offers: [
        {
            code: 'STAYFIRST',
            title: 'First Booking Discount',
            description: 'Get 15% off on your first villa stay with us.',
            validTill: 'Mar 31, 2026',
        },
        {
            code: 'WEEKEND20',
            title: 'Weekend Getaway Deal',
            description: 'Flat 20% off on weekend bookings (Fri–Sun).',
            validTill: 'Apr 15, 2026',
        },
        {
            code: 'LONGSTAY',
            title: '5-Night Special',
            description: 'Book 5 nights, pay for only 4. Stay longer, save more.',
            validTill: 'May 30, 2026',
        },
    ],

    story: `Nestled in the serene hills of Kasauli, The Ivory Manor is a stunning 4-bedroom luxury villa that offers an unparalleled retreat from the hustle and bustle of city life. Surrounded by towering pine and cedar trees, this property sits at an elevation of 6,000 feet, offering breathtaking panoramic views of the Shivalik range.\n\nThe villa features a spacious open-plan living area with floor-to-ceiling windows that flood the space with natural light and frame the spectacular mountain scenery. The interiors blend contemporary design with warm wooden accents, creating an atmosphere of refined comfort.\n\nEach of the four bedrooms has been thoughtfully designed as a private sanctuary, complete with premium bedding, en-suite bathrooms, and individual temperature controls. The master suite boasts a private balcony where you can sip your morning chai while watching the sunrise paint the valley in shades of gold.\n\nOutdoors, the heated infinity pool seems to merge with the sky, while the manicured garden provides the perfect setting for al-fresco dining and evening bonfires under a blanket of stars.`,

    bedroomDetails: [
        { name: 'Master Suite', size: '400 sq ft', bedType: 'King Bed', floor: 'First Floor', features: ['Balcony', 'Mountain View', 'Walk-in Wardrobe', 'AC'], hasBalcony: true },
        { name: 'Valley View Room', size: '300 sq ft', bedType: 'Queen Bed', floor: 'First Floor', features: ['Balcony', 'Valley View', 'AC', 'TV'], hasBalcony: true },
        { name: 'Garden Room', size: '280 sq ft', bedType: 'Queen Bed', floor: 'Ground Floor', features: ['Garden Access', 'AC', 'Wardrobe'], hasBalcony: false },
        { name: 'Twin Room', size: '250 sq ft', bedType: 'Twin Beds', floor: 'Ground Floor', features: ['AC', 'TV', 'Wardrobe', 'Locker'], hasBalcony: false },
    ],

    bathroomDetails: [
        { name: 'Master Bathroom', shower: 'Rainfall Shower + Bathtub', amenities: ['Premium Toiletries', 'Heated Tiles', 'Double Vanity'] },
        { name: 'Bathroom 2', shower: 'Rainfall Shower', amenities: ['Toiletries Kit', 'Towel Warmer'] },
        { name: 'Bathroom 3', shower: 'Standard Shower', amenities: ['Toiletries Kit', 'Hair Dryer'] },
    ],

    amenities: {
        popular: ['Private Pool', 'Mountain View', 'Fireplace', 'BBQ Area', 'Bonfire Pit', 'Indoor Games', 'Parking'],
        kitchen: ['Modular Kitchen', 'Refrigerator', 'Microwave', 'Electric Kettle', 'Coffee Maker', 'Crockery Set', 'Water Purifier'],
        outdoor: ['Garden', 'Sit-out Area', 'Infinity Pool', 'Deck', 'Sun Loungers', 'Swing'],
        entertainment: ['Smart TV', 'Bluetooth Speaker', 'Board Games', 'Books Library', 'Card Games'],
        safety: ['CCTV', 'Fire Extinguisher', 'First Aid Kit', 'Caretaker on Site', 'Gated Property'],
    },

    spaces: [
        { name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop', description: 'Spacious open-plan living with floor-to-ceiling windows and valley views.', features: ['Smart TV', 'Fireplace', 'Seating for 10'] },
        { name: 'Dining Area', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop', description: 'Elegant 8-seater dining with rustic wooden table and ambient lighting.', features: ['8-Seater Table', 'Ambient Lighting'] },
        { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop', description: 'Fully equipped modular kitchen with premium appliances.', features: ['Modular', 'Coffee Maker', 'Microwave'] },
        { name: 'Infinity Pool', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop', description: 'Heated infinity pool overlooking the valley with sun loungers.', features: ['Heated', 'Valley View', 'Loungers'] },
        { name: 'Garden', image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop', description: 'Manicured lawns perfect for bonfires and outdoor gatherings.', features: ['Bonfire Pit', 'BBQ', 'Seating'] },
        { name: 'Workstation', image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=2070&auto=format&fit=crop', description: 'Quiet corner with a desk and high-speed WiFi for remote work.', features: ['Desk', 'WiFi', 'Charging Points'] },
    ],

    experiences: [
        { name: 'BBQ & Bonfire', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop', price: 2500, description: 'Veg/Non-veg BBQ setup with bonfire under the stars.' },
        { name: 'Private Chef', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop', price: 3500, description: 'Multi-cuisine chef for breakfast, lunch & dinner.' },
        { name: 'Floating Breakfast', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop', price: 1800, description: 'Instagram-worthy poolside floating breakfast tray.' },
        { name: 'Yoga & Meditation', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop', price: 2000, description: 'Guided morning yoga and meditation session by the pool.', slug: 'wellness' },
        { name: 'Celebration Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070&auto=format&fit=crop', price: 4000, description: 'Balloon, flower, and fairy-light decoration for celebrations.', slug: 'celebrations' },
        { name: 'Intimate Wedding Setup', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop', price: 45000, description: 'Bespoke décor and planning for intimate garden weddings.', slug: 'weddings' },
        { name: 'Corporate Retreat', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop', price: 50000, description: 'Professional setup and planning for executive retreats and team-building.', slug: 'corporate' },
    ],

    locationInfo: {
        address: 'Near Heritage Market, Kasauli, Himachal Pradesh 173204',
        mapUrl: 'https://maps.google.com/?q=30.8985,76.9615',
        lat: 30.8985,
        lng: 76.9615,
        nearbyAttractions: [
            { name: 'Monkey Point', distance: '3 km' },
            { name: 'Christ Church', distance: '1.5 km' },
            { name: 'Kasauli Brewery', distance: '2 km' },
            { name: 'Sunset Point', distance: '4 km' },
            { name: 'Gilbert Trail', distance: '2.5 km' },
        ],
        distances: {
            airport: 'Chandigarh Airport – 65 km (2 hrs)',
            railway: 'Kalka Railway Station – 35 km (1 hr)',
            busStand: 'Kasauli Bus Stand – 2 km',
        },
        travelTips: [
            'Best time to visit: March to June & September to November.',
            'Roads are well-maintained. Drive carefully on hairpin bends.',
            'Carry warm layers — evenings can get chilly even in summer.',
        ],
    },

    policies: {
        checkIn: { time: '2:00 PM', earlyCheckIn: 'Subject to availability (extra charges may apply)', instructions: 'Caretaker will greet you at the property. Share your ETA in advance.' },
        checkOut: { time: '11:00 AM', lateCheckOut: 'Available till 1:00 PM at ₹2,000 extra.' },
        rules: ['No loud music after 10 PM', 'No smoking indoors', 'Pets allowed (inform in advance)', 'ID proof mandatory at check-in', 'No outside guests without prior approval'],
        deposit: { amount: 5000, refundable: true, note: 'Refunded within 48 hours post check-out after damage inspection.' },
        meals: { included: 'Breakfast included', options: ['Lunch & Dinner available at extra cost', 'Private chef can be booked', 'Kitchen available for self-cooking'] },
        cancellation: [
            { period: 'More than 30 days before check-in', refund: 'Full refund' },
            { period: '15–30 days before check-in', refund: '50% refund' },
            { period: 'Less than 15 days', refund: 'No refund' },
        ],
        faqs: [
            { q: 'Is the pool heated?', a: 'Yes, the pool is heated and available year-round.' },
            { q: 'Are pets allowed?', a: 'Yes, pets are welcome. Please inform us during booking.' },
            { q: 'Is there Wi-Fi?', a: 'Yes, high-speed Wi-Fi is available throughout the property.' },
            { q: 'Can we host events?', a: 'Small celebrations up to 20 guests are allowed with prior approval.' },
        ],
    },

    reviews: [
        { name: 'Priya Sharma', rating: 5, date: 'Jan 2026', platform: 'Google', comment: 'Absolutely stunning property! The views are breathtaking and the pool is amazing. The caretaker was very helpful. Will definitely come back.' },
        { name: 'Rahul Mehta', rating: 5, date: 'Dec 2025', platform: 'Airbnb', comment: 'Perfect getaway for our family. Kids loved the garden and pool. The villa is exactly as shown in photos, if not better.' },
        { name: 'Ananya Gupta', rating: 4, date: 'Nov 2025', platform: 'Google', comment: 'Beautiful property with great amenities. Only minor issue was the road to the villa is a bit steep. Rest everything was perfect.' },
        { name: 'Vikram Singh', rating: 5, date: 'Oct 2025', platform: 'Booking.com', comment: 'We hosted a small birthday celebration here and it was magical. The bonfire setup and chef service were outstanding.' },
        { name: 'Sneha Patel', rating: 5, date: 'Sep 2025', platform: 'Google', comment: 'The master bedroom view is worth every penny. Waking up to the sunrise over the valley was an experience of a lifetime.' },
        { name: 'Arjun Nair', rating: 4, date: 'Aug 2025', platform: 'Airbnb', comment: 'Great villa for a workation. The Wi-Fi was reliable and the workstation corner is a nice touch. Pool time after work was the best!' },
    ],

    similarVillas: [
        { slug: 'villa-del-sol', name: 'Villa del Sol', location: 'Alibaug, Maharashtra', price: 24000, guests: 12, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop' },
        { slug: 'serenity-heights', name: 'Serenity Heights', location: 'Lonavala, Maharashtra', price: 15200, guests: 6, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop' },
        { slug: 'the-grand-chateau', name: 'The Grand Chateau', location: 'Goa', price: 32000, guests: 16, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' },
        { slug: 'woodland-retreat', name: 'Woodland Retreat', location: 'Coorg, Karnataka', price: 12800, guests: 4, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop' },
    ],
};

export default villaData;
