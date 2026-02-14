/**
 * Database Seed Script
 * Seeds the database with data from the existing villaData.js and experienceData.js
 *
 * Run with: npx tsx prisma/seed.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || '' });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...\n');

    // ═══════════════════════════════════════
    // 1. SEED ADMIN USER
    // ═══════════════════════════════════════
    const admin = await prisma.user.upsert({
        where: { email: 'admin@stayxl.com' },
        update: {},
        create: {
            email: 'admin@stayxl.com',
            name: 'StayXL Admin',
            role: 'ADMIN',
            emailVerified: true,
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // ═══════════════════════════════════════
    // 2. SEED VILLA — The Ivory Manor
    // ═══════════════════════════════════════
    const ivoryManor = await prisma.villa.upsert({
        where: { slug: 'the-ivory-manor' },
        update: {},
        create: {
            slug: 'the-ivory-manor',
            name: 'The Ivory Manor',
            tagline: 'A Serene Hilltop Retreat With Panoramic Valley Views',
            location: 'Kasauli, Himachal Pradesh',
            rating: 4.9,
            reviewCount: 127,
            guests: 8,
            bedroomCount: 4,
            bathroomCount: 3,
            area: '3,200 sq ft',
            pricePerNight: 18500,
            originalPrice: 24000,
            highlights: ['Private Pool', 'Mountain View', 'Pet Friendly', 'Fireplace'],
            isFeatured: true,
            story: `Nestled in the serene hills of Kasauli, The Ivory Manor is a stunning 4-bedroom luxury villa that offers an unparalleled retreat from the hustle and bustle of city life. Surrounded by towering pine and cedar trees, this property sits at an elevation of 6,000 feet, offering breathtaking panoramic views of the Shivalik range.\n\nThe villa features a spacious open-plan living area with floor-to-ceiling windows that flood the space with natural light and frame the spectacular mountain scenery. The interiors blend contemporary design with warm wooden accents, creating an atmosphere of refined comfort.\n\nEach of the four bedrooms has been thoughtfully designed as a private sanctuary, complete with premium bedding, en-suite bathrooms, and individual temperature controls. The master suite boasts a private balcony where you can sip your morning chai while watching the sunrise paint the valley in shades of gold.\n\nOutdoors, the heated infinity pool seems to merge with the sky, while the manicured garden provides the perfect setting for al-fresco dining and evening bonfires under a blanket of stars.`,
        },
    });
    console.log('✅ Villa created:', ivoryManor.name);

    // Villa Images
    const villaImages = [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
    ];
    for (let i = 0; i < villaImages.length; i++) {
        await prisma.villaImage.create({
            data: { villaId: ivoryManor.id, url: villaImages[i], sortOrder: i },
        });
    }
    console.log('  📸 Images seeded');

    // Bedrooms
    const bedrooms = [
        { name: 'Master Suite', size: '400 sq ft', bedType: 'King Bed', floor: 'First Floor', features: ['Balcony', 'Mountain View', 'Walk-in Wardrobe', 'AC'], hasBalcony: true },
        { name: 'Valley View Room', size: '300 sq ft', bedType: 'Queen Bed', floor: 'First Floor', features: ['Balcony', 'Valley View', 'AC', 'TV'], hasBalcony: true },
        { name: 'Garden Room', size: '280 sq ft', bedType: 'Queen Bed', floor: 'Ground Floor', features: ['Garden Access', 'AC', 'Wardrobe'], hasBalcony: false },
        { name: 'Twin Room', size: '250 sq ft', bedType: 'Twin Beds', floor: 'Ground Floor', features: ['AC', 'TV', 'Wardrobe', 'Locker'], hasBalcony: false },
    ];
    for (const br of bedrooms) {
        await prisma.bedroom.create({ data: { villaId: ivoryManor.id, ...br } });
    }
    console.log('  🛏️  Bedrooms seeded');

    // Bathrooms
    const bathrooms = [
        { name: 'Master Bathroom', shower: 'Rainfall Shower + Bathtub', amenities: ['Premium Toiletries', 'Heated Tiles', 'Double Vanity'] },
        { name: 'Bathroom 2', shower: 'Rainfall Shower', amenities: ['Toiletries Kit', 'Towel Warmer'] },
        { name: 'Bathroom 3', shower: 'Standard Shower', amenities: ['Toiletries Kit', 'Hair Dryer'] },
    ];
    for (const bth of bathrooms) {
        await prisma.bathroom.create({ data: { villaId: ivoryManor.id, ...bth } });
    }
    console.log('  🚿 Bathrooms seeded');

    // Amenities
    const amenities: Record<string, string[]> = {
        popular: ['Private Pool', 'Mountain View', 'Fireplace', 'BBQ Area', 'Bonfire Pit', 'Indoor Games', 'Parking'],
        kitchen: ['Modular Kitchen', 'Refrigerator', 'Microwave', 'Electric Kettle', 'Coffee Maker', 'Crockery Set', 'Water Purifier'],
        outdoor: ['Garden', 'Sit-out Area', 'Infinity Pool', 'Deck', 'Sun Loungers', 'Swing'],
        entertainment: ['Smart TV', 'Bluetooth Speaker', 'Board Games', 'Books Library', 'Card Games'],
        safety: ['CCTV', 'Fire Extinguisher', 'First Aid Kit', 'Caretaker on Site', 'Gated Property'],
    };
    for (const [category, items] of Object.entries(amenities)) {
        for (const name of items) {
            await prisma.amenity.create({ data: { villaId: ivoryManor.id, category, name } });
        }
    }
    console.log('  ✨ Amenities seeded');

    // Spaces
    const spaces = [
        { name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop', description: 'Spacious open-plan living with floor-to-ceiling windows and valley views.', features: ['Smart TV', 'Fireplace', 'Seating for 10'] },
        { name: 'Dining Area', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop', description: 'Elegant 8-seater dining with rustic wooden table and ambient lighting.', features: ['8-Seater Table', 'Ambient Lighting'] },
        { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop', description: 'Fully equipped modular kitchen with premium appliances.', features: ['Modular', 'Coffee Maker', 'Microwave'] },
        { name: 'Infinity Pool', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop', description: 'Heated infinity pool overlooking the valley with sun loungers.', features: ['Heated', 'Valley View', 'Loungers'] },
        { name: 'Garden', image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop', description: 'Manicured lawns perfect for bonfires and outdoor gatherings.', features: ['Bonfire Pit', 'BBQ', 'Seating'] },
        { name: 'Workstation', image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=2070&auto=format&fit=crop', description: 'Quiet corner with a desk and high-speed WiFi for remote work.', features: ['Desk', 'WiFi', 'Charging Points'] },
    ];
    for (const sp of spaces) {
        await prisma.space.create({ data: { villaId: ivoryManor.id, ...sp } });
    }
    console.log('  🏠 Spaces seeded');

    // Location info
    await prisma.locationInfo.create({
        data: {
            villaId: ivoryManor.id,
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
    });
    console.log('  📍 Location info seeded');

    // Policies
    await prisma.villaPolicy.create({
        data: {
            villaId: ivoryManor.id,
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
    });
    console.log('  📋 Policies seeded');

    // Reviews
    const reviews = [
        { name: 'Priya Sharma', rating: 5, date: 'Jan 2026', platform: 'Google', comment: 'Absolutely stunning property! The views are breathtaking and the pool is amazing. The caretaker was very helpful. Will definitely come back.' },
        { name: 'Rahul Mehta', rating: 5, date: 'Dec 2025', platform: 'Airbnb', comment: 'Perfect getaway for our family. Kids loved the garden and pool. The villa is exactly as shown in photos, if not better.' },
        { name: 'Ananya Gupta', rating: 4, date: 'Nov 2025', platform: 'Google', comment: 'Beautiful property with great amenities. Only minor issue was the road to the villa is a bit steep. Rest everything was perfect.' },
        { name: 'Vikram Singh', rating: 5, date: 'Oct 2025', platform: 'Booking.com', comment: 'We hosted a small birthday celebration here and it was magical. The bonfire setup and chef service were outstanding.' },
        { name: 'Sneha Patel', rating: 5, date: 'Sep 2025', platform: 'Google', comment: 'The master bedroom view is worth every penny. Waking up to the sunrise over the valley was an experience of a lifetime.' },
        { name: 'Arjun Nair', rating: 4, date: 'Aug 2025', platform: 'Airbnb', comment: 'Great villa for a workation. The Wi-Fi was reliable and the workstation corner is a nice touch. Pool time after work was the best!' },
    ];
    for (const r of reviews) {
        const reviewer = await prisma.user.create({
            data: { name: r.name, email: `${r.name.toLowerCase().replace(/\s+/g, '.')}@example.com` },
        });
        await prisma.review.create({
            data: { userId: reviewer.id, villaId: ivoryManor.id, rating: r.rating, comment: r.comment, platform: r.platform },
        });
    }
    console.log('  ⭐ Reviews seeded');

    // ═══════════════════════════════════════
    // 3. SEED MORE VILLAS (similar villas)
    // ═══════════════════════════════════════
    const similarVillas = [
        { slug: 'villa-del-sol', name: 'Villa del Sol', location: 'Alibaug, Maharashtra', pricePerNight: 24000, guests: 12, bedroomCount: 6, bathroomCount: 5, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop' },
        { slug: 'serenity-heights', name: 'Serenity Heights', location: 'Lonavala, Maharashtra', pricePerNight: 15200, guests: 6, bedroomCount: 3, bathroomCount: 2, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop' },
        { slug: 'the-grand-chateau', name: 'The Grand Chateau', location: 'Goa', pricePerNight: 32000, guests: 16, bedroomCount: 8, bathroomCount: 6, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' },
        { slug: 'woodland-retreat', name: 'Woodland Retreat', location: 'Coorg, Karnataka', pricePerNight: 12800, guests: 4, bedroomCount: 2, bathroomCount: 2, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop' },
    ];

    for (const v of similarVillas) {
        const { image, ...villaData } = v;
        const villa = await prisma.villa.upsert({
            where: { slug: v.slug },
            update: {},
            create: {
                ...villaData,
                rating: 4.5 + Math.random() * 0.5,
                reviewCount: Math.floor(Math.random() * 80) + 20,
                highlights: ['Private Pool', 'Mountain View'],
            },
        });
        await prisma.villaImage.create({
            data: { villaId: villa.id, url: image, sortOrder: 0 },
        });
        console.log(`✅ Villa created: ${villa.name}`);
    }

    // ═══════════════════════════════════════
    // 4. SEED OFFERS
    // ═══════════════════════════════════════
    const offers = [
        { code: 'STAYFIRST', title: 'First Booking Discount', description: 'Get 15% off on your first villa stay with us.', discountType: 'PERCENTAGE' as const, discountValue: 15, maxDiscount: 5000, validTill: new Date('2026-03-31') },
        { code: 'WEEKEND20', title: 'Weekend Getaway Deal', description: 'Flat 20% off on weekend bookings (Fri–Sun).', discountType: 'PERCENTAGE' as const, discountValue: 20, maxDiscount: 8000, validTill: new Date('2026-04-15') },
        { code: 'LONGSTAY', title: '5-Night Special', description: 'Book 5 nights, pay for only 4. Stay longer, save more.', discountType: 'PERCENTAGE' as const, discountValue: 20, maxDiscount: 10000, minBookingAmount: 50000, validTill: new Date('2026-05-30') },
    ];

    for (const offer of offers) {
        await prisma.offer.upsert({
            where: { code: offer.code },
            update: {},
            create: offer,
        });
    }
    console.log('✅ Offers seeded');

    // ═══════════════════════════════════════
    // 5. SEED EXPERIENCES
    // ═══════════════════════════════════════
    const experienceEntries = [
        {
            slug: 'weddings',
            caption: 'Luxury Wedding Experiences',
            heading: 'Celebrate Your Dream Wedding in Paradise',
            subtext: 'Exchange vows in breathtaking beachfront and hillside villas curated for unforgettable celebrations.',
            heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
            intro: {
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2070&auto=format&fit=crop',
                heading: 'Where Forever Begins',
                description: 'Imagine saying "I do" beneath a canopy of stars in a private hilltop estate.',
                highlights: ['Intimate venues for 20–200 guests', 'Personal wedding concierge', 'Luxury décor & floral design'],
            },
            features: [
                { icon: '💎', title: 'Bespoke Planning', description: 'A dedicated wedding planner handles every detail.' },
                { icon: '🌸', title: 'Luxury Décor', description: 'Curated themes with premium florals, lighting, and fabrics.' },
            ],
            gallery: [
                'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2070&auto=format&fit=crop',
            ],
            testimonials: [{ quote: 'Our wedding was beyond anything we imagined.', name: 'Priya & Karan', type: 'Destination Wedding' }],
            faqs: [{ q: 'How many guests can you accommodate?', a: 'Our villas can host 20–200 guests.' }],
            ctaHeadline: 'Ready to Plan Your Dream Wedding?',
            ctaSubtext: 'Our wedding specialists are here to help.',
            services: [
                { name: 'Mehendi & Haldi Setup', description: 'Traditional ceremony décor.', icon: '🌼', price: '₹25,000' },
                { name: 'Private Chef', description: '3-day wedding menu.', icon: '👨‍🍳', price: '₹1,50,000' },
                { name: 'Floral & Mandap Design', description: 'Custom mandap with premium florals.', icon: '💐', price: '₹75,000' },
            ],
        },
        {
            slug: 'corporate',
            caption: 'Corporate Retreat Experiences',
            heading: 'Elevate Your Team. Inspire Brilliance.',
            subtext: 'Host impactful offsites in stunning private villas.',
            heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
            intro: {
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop',
                heading: 'Where Great Ideas Are Born',
                description: 'Break free from boardrooms and cubicles.',
                highlights: ['High-speed Wi-Fi', 'Dedicated meeting spaces', 'Team-building activities'],
            },
            features: [{ icon: '🎯', title: 'Strategy Sessions', description: 'Spacious meeting areas with AV gear.' }],
            gallery: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'],
            testimonials: [{ quote: 'Best retreat we\'ve ever had.', name: 'Ravi K., CTO', type: 'Leadership Retreat' }],
            faqs: [{ q: 'Is high-speed internet available?', a: 'Yes, all properties have high-speed Wi-Fi.' }],
            ctaHeadline: 'Plan Your Next Team Retreat',
            ctaSubtext: 'Our corporate experience team will design the perfect offsite.',
            services: [
                { name: 'AV & Tech Setup', description: 'Projectors, speakers, whiteboards.', icon: '🖥️', price: '₹15,000' },
                { name: 'Outdoor Team Activities', description: 'Treasure hunts, bonfire sessions.', icon: '🏕️', price: '₹20,000' },
            ],
        },
        {
            slug: 'celebrations',
            caption: 'Private Celebration Experiences',
            heading: 'Create Moments That Last Forever',
            subtext: 'Birthdays, anniversaries, milestones — celebrate in extraordinary private villas.',
            heroImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070&auto=format&fit=crop',
            intro: {
                image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2070&auto=format&fit=crop',
                heading: 'Every Milestone Deserves Magic',
                description: 'We transform private villas into the ultimate celebration venues.',
                highlights: ['Custom party décor', 'Private chef & bar service', 'Photography'],
            },
            features: [{ icon: '🎂', title: 'Custom Celebrations', description: 'From golden jubilees to surprise parties.' }],
            gallery: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070&auto=format&fit=crop'],
            testimonials: [{ quote: 'StayXL planned the entire surprise 40th!', name: 'Vikram S.', type: 'Surprise Birthday' }],
            faqs: [{ q: 'Can you plan a surprise?', a: 'Yes! We specialize in surprise coordination.' }],
            ctaHeadline: 'Plan Your Celebration',
            ctaSubtext: 'Let our events team help you.',
            services: [
                { name: 'Celebration Décor', description: 'Balloon installations, flower walls.', icon: '🎈', price: '₹15,000' },
                { name: 'Private Bar & Mixologist', description: 'Craft cocktails and curated drinks.', icon: '🍸', price: '₹12,000' },
            ],
        },
        {
            slug: 'wellness',
            caption: 'Wellness Retreat Experiences',
            heading: 'Find Your Inner Peace',
            subtext: 'Restore, rejuvenate, and reconnect in serene private sanctuaries.',
            heroImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
            intro: {
                image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop',
                heading: 'Slow Down. Breathe. Reset.',
                description: 'Wellness retreats combining yoga, meditation, and Ayurvedic treatments.',
                highlights: ['Certified yoga instructors', 'Ayurvedic spa', 'Organic cuisine'],
            },
            features: [{ icon: '🧘', title: 'Yoga & Meditation', description: 'Daily sessions led by certified instructors.' }],
            gallery: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop'],
            testimonials: [{ quote: 'Three days completely reset my system.', name: 'Kavya R.', type: 'Solo Wellness Retreat' }],
            faqs: [{ q: 'Do I need prior yoga experience?', a: 'Not at all! Sessions for all levels.' }],
            ctaHeadline: 'Begin Your Wellness Journey',
            ctaSubtext: 'Our wellness coordinators will craft the perfect retreat.',
            services: [
                { name: 'Personal Yoga Instructor', description: 'Customized sessions.', icon: '🧘', price: '₹5,000/session' },
                { name: 'Ayurvedic Spa Package', description: 'Full-day treatment with consultation.', icon: '💆', price: '₹12,000' },
            ],
        },
    ];

    for (const exp of experienceEntries) {
        const { services, ...expData } = exp;
        const experience = await prisma.experience.upsert({
            where: { slug: exp.slug },
            update: {},
            create: expData,
        });

        for (const svc of services) {
            await prisma.experienceService.create({
                data: { experienceId: experience.id, ...svc },
            });
        }
        console.log(`✅ Experience seeded: ${experience.heading}`);
    }

    // ═══════════════════════════════════════
    // 6. LINK VILLAS TO EXPERIENCES
    // ═══════════════════════════════════════
    const villaExperienceLinks: Record<string, string[]> = {
        'the-ivory-manor': ['corporate', 'wellness', 'celebrations'],
        'the-grand-chateau': ['weddings', 'celebrations'],
        'villa-del-sol': ['weddings', 'celebrations'],
        'serenity-heights': ['corporate', 'wellness'],
        'woodland-retreat': ['wellness'],
    };

    for (const [villaSlug, expSlugs] of Object.entries(villaExperienceLinks)) {
        const villa = await prisma.villa.findUnique({ where: { slug: villaSlug } });
        if (!villa) continue;
        for (const expSlug of expSlugs) {
            const experience = await prisma.experience.findUnique({ where: { slug: expSlug } });
            if (!experience) continue;
            await prisma.villaExperience.upsert({
                where: { villaId_experienceId: { villaId: villa.id, experienceId: experience.id } },
                update: {},
                create: { villaId: villa.id, experienceId: experience.id },
            });
        }
    }
    console.log('✅ Villa-Experience links created');

    console.log('\n🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
