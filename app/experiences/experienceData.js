/* ═══════════════════════════════════════════
   Experience Data — drives /experiences/[slug]
   ═══════════════════════════════════════════ */

const experienceData = {
    /* ─────────────────── WEDDINGS ─────────────────── */
    weddings: {
        slug: 'weddings',
        caption: 'Luxury Wedding Experiences',
        heading: 'Celebrate Your Dream Wedding in Paradise',
        subtext: 'Exchange vows in breathtaking beachfront and hillside villas curated for unforgettable celebrations.',
        heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
        heroVideo: null,
        intro: {
            image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2070&auto=format&fit=crop',
            heading: 'Where Forever Begins',
            description: 'Imagine saying "I do" beneath a canopy of stars in a private hilltop estate, or on a sun-kissed deck overlooking the Arabian Sea. Our wedding experiences blend intimate luxury with world-class hospitality — every flower, every note of music, every candlelit pathway designed to reflect your love story.',
            highlights: ['Intimate venues for 20–200 guests', 'Personal wedding concierge', 'Luxury décor & floral design', 'Multi-cuisine private chef', 'Photography & videography coordination'],
        },
        features: [
            { icon: '💎', title: 'Bespoke Planning', description: 'A dedicated wedding planner handles every detail — from venue styling to guest logistics — so you can focus on the magic.' },
            { icon: '🌸', title: 'Luxury Décor', description: 'Choose from curated themes or let our designers craft a one-of-a-kind setup with premium florals, lighting, and fabrics.' },
            { icon: '🍽️', title: 'Gourmet Dining', description: 'From rehearsal dinners to reception menus, our private chefs create multi-course culinary journeys.' },
            { icon: '🎵', title: 'Entertainment', description: 'Live bands, DJs, traditional performances — we curate the perfect soundtrack for your celebration.' },
        ],
        villas: [
            { name: 'The Grand Chateau', location: 'North Goa', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', guests: 16, beds: 8, slug: 'the-grand-chateau' },
            { name: 'Villa del Sol', location: 'Alibaug, Maharashtra', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop', guests: 12, beds: 6, slug: 'villa-del-sol' },
            { name: 'Azure Bay Estate', location: 'Kochi, Kerala', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop', guests: 10, beds: 5, slug: 'azure-bay-estate' },
        ],
        services: [
            { name: 'Mehendi & Haldi Setup', description: 'Traditional ceremony décor with marigold canopies and brass accents.', icon: '🌼', price: '₹25,000' },
            { name: 'Private Chef (Multi-Day)', description: '3-day wedding menu with welcome dinner, ceremonies & reception.', icon: '👨‍🍳', price: '₹1,50,000' },
            { name: 'Floral & Mandap Design', description: 'Custom mandap with premium florals, draping, and lighting.', icon: '💐', price: '₹75,000' },
            { name: 'Live Music & DJ', description: 'Professional DJ + live band for sangeet and reception.', icon: '🎶', price: '₹50,000' },
            { name: 'Photography Package', description: 'Pre-wedding, ceremony, and reception coverage with drone shots.', icon: '📸', price: '₹1,00,000' },
        ],
        timeline: [
            { step: 1, title: 'Share Your Vision', description: 'Tell us your dream — dates, guest count, preferred location, and style.' },
            { step: 2, title: 'Consultation & Venue Selection', description: 'Our wedding concierge shortlists the perfect villa and walks you through every option.' },
            { step: 3, title: 'Custom Planning & Design', description: 'From décor mood boards to menu tastings — every detail is curated to your preferences.' },
            { step: 4, title: 'Celebrate & Cherish', description: 'Arrive, exhale, and let us handle everything. Your only job is to celebrate.' },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070&auto=format&fit=crop',
        ],
        testimonials: [
            { quote: 'Our wedding at The Grand Chateau was beyond anything we imagined. The sunset ceremony, the fairy-lit garden reception — StayXL made our dream come true.', name: 'Priya & Karan', type: 'Destination Wedding' },
            { quote: 'From the mandap design to the farewell brunch, every single detail was perfect. Our 80 guests are still raving about it.', name: 'Ananya & Rohit', type: 'Traditional Wedding' },
            { quote: 'We wanted an intimate beach wedding and StayXL delivered magic. Just 30 of our closest people, barefoot on the sand, with the most beautiful sunset.', name: 'Meera & James', type: 'Beach Wedding' },
        ],
        faqs: [
            { q: 'How many guests can you accommodate for a wedding?', a: 'Our villas can host intimate weddings of 20–200 guests depending on the property. We help you select the perfect venue for your guest list.' },
            { q: 'Do you handle wedding planning end-to-end?', a: 'Yes! Our dedicated wedding concierge manages everything from vendor coordination to day-of logistics. You just show up and celebrate.' },
            { q: 'Can we customize the décor and menu?', a: 'Absolutely. Every wedding is bespoke. You choose themes, colors, cuisines, and we bring your vision to life.' },
            { q: 'What about accommodation for guests?', a: 'We can arrange stays at nearby partner villas and hotels for your guests, with shuttle services included.' },
            { q: 'How far in advance should we book?', a: 'We recommend booking 6–12 months in advance for peak wedding season (Oct–Feb). Off-season bookings can be arranged with 3 months notice.' },
        ],
        ctaHeadline: 'Ready to Plan Your Dream Wedding?',
        ctaSubtext: 'Our wedding specialists are here to help you create the celebration of a lifetime.',
    },

    /* ─────────────────── CORPORATE ─────────────────── */
    corporate: {
        slug: 'corporate',
        caption: 'Corporate Retreat Experiences',
        heading: 'Elevate Your Team. Inspire Brilliance.',
        subtext: 'Host impactful offsites, leadership retreats, and team-building experiences in stunning private villas.',
        heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
        heroVideo: null,
        intro: {
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop',
            heading: 'Where Great Ideas Are Born',
            description: 'Break free from boardrooms and cubicles. Our handpicked villas provide the perfect blend of focused workspaces and relaxing retreats — designed to spark creativity, strengthen bonds, and drive results.',
            highlights: ['High-speed Wi-Fi in every property', 'Dedicated meeting spaces', 'Team-building activity curation', 'Multi-cuisine catering', 'AV equipment & projectors'],
        },
        features: [
            { icon: '🎯', title: 'Strategy Sessions', description: 'Spacious meeting areas with whiteboards, AV gear, and distraction-free zones for deep work and brainstorming.' },
            { icon: '🤝', title: 'Team Building', description: 'Curated outdoor activities, games, and collaborative challenges designed to strengthen team dynamics.' },
            { icon: '🍳', title: 'Catered Meals', description: 'All-day catering with healthy meals, snack breaks, and evening BBQ or cocktail sessions.' },
            { icon: '🧘', title: 'Wellness Integration', description: 'Morning yoga, meditation sessions, and spa treatments to recharge between intensive work blocks.' },
        ],
        villas: [
            { name: 'The Ivory Manor', location: 'Kasauli, Himachal Pradesh', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop', guests: 8, beds: 4, slug: 'the-ivory-manor' },
            { name: 'Serenity Heights', location: 'Lonavala, Maharashtra', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop', guests: 6, beds: 3, slug: 'serenity-heights' },
            { name: 'Woodland Retreat', location: 'Coorg, Karnataka', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop', guests: 4, beds: 2, slug: 'woodland-retreat' },
        ],
        services: [
            { name: 'AV & Tech Setup', description: 'Projectors, speakers, whiteboards, and high-speed backup internet.', icon: '🖥️', price: '₹15,000' },
            { name: 'Outdoor Team Activities', description: 'Treasure hunts, rope courses, bonfire sessions, and more.', icon: '🏕️', price: '₹20,000' },
            { name: 'All-Day Catering', description: 'Breakfast, lunch, dinner, and snack stations throughout the day.', icon: '🍽️', price: '₹3,500/person' },
            { name: 'Wellness Package', description: 'Morning yoga, guided meditation, and evening spa treatments.', icon: '🧘', price: '₹8,000' },
            { name: 'Photography', description: 'Candid team photography and drone coverage of the retreat.', icon: '📷', price: '₹25,000' },
        ],
        timeline: [
            { step: 1, title: 'Brief Us', description: 'Share your team size, objectives, preferred dates, and any specific requirements.' },
            { step: 2, title: 'Custom Proposal', description: 'We design a tailored retreat plan with venue options, itinerary, and pricing.' },
            { step: 3, title: 'Confirm & Prepare', description: 'Lock in the villa, finalize activities, confirm your equipment and catering needs.' },
            { step: 4, title: 'Retreat & Recharge', description: 'Arrive to a fully prepped villa. We handle logistics so your team can focus on what matters.' },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop',
        ],
        testimonials: [
            { quote: 'Our Q4 offsite at The Ivory Manor was the best retreat we\'ve ever had. The team came back energized and more aligned than ever.', name: 'Ravi K., CTO at Finova', type: 'Leadership Retreat' },
            { quote: 'StayXL handled everything — from the AV setup to the bonfire. We just focused on our strategy sessions and team bonding.', name: 'Neha S., HR Director', type: 'Team Building' },
            { quote: '20 engineers, 3 days, zero distractions. The Wi-Fi was rock solid, the food was amazing, and the pool was the perfect break.', name: 'Arjun M., Engineering Lead', type: 'Dev Sprint' },
        ],
        faqs: [
            { q: 'What\'s the ideal group size for a corporate retreat?', a: 'Our properties comfortably host teams of 4–20 people. For larger groups, we can arrange multiple nearby villas.' },
            { q: 'Is high-speed internet available?', a: 'Yes, all our properties have high-speed Wi-Fi. We also provide backup connectivity and can arrange dedicated lines for critical meetings.' },
            { q: 'Can you arrange team-building activities?', a: 'Absolutely! We offer curated indoor and outdoor activities tailored to your team\'s goals — from collaborative challenges to adventure sports.' },
            { q: 'Do you provide invoicing for corporate bookings?', a: 'Yes, we issue GST-compliant invoices suitable for corporate expense reporting.' },
            { q: 'Can we customize the schedule?', a: 'Every retreat is fully customizable. Share your agenda and we\'ll design the venue setup, meals, and activities around it.' },
        ],
        ctaHeadline: 'Plan Your Next Team Retreat',
        ctaSubtext: 'Our corporate experience team will design the perfect offsite for your organization.',
    },

    /* ─────────────────── CELEBRATIONS ─────────────────── */
    celebrations: {
        slug: 'celebrations',
        caption: 'Private Celebration Experiences',
        heading: 'Create Moments That Last Forever',
        subtext: 'Birthdays, anniversaries, milestones — celebrate life\'s greatest moments in extraordinary private villas.',
        heroImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070&auto=format&fit=crop',
        heroVideo: null,
        intro: {
            image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2070&auto=format&fit=crop',
            heading: 'Every Milestone Deserves Magic',
            description: 'Whether it\'s a surprise 30th, a golden anniversary, or a graduation weekend — we transform private villas into the ultimate celebration venues. Think fairy-lit gardens, private chefs, custom cakes, and a team that handles every last detail so you can be fully present in the moment.',
            highlights: ['Custom party décor & themes', 'Private chef & bar service', 'Surprise planning & coordination', 'Photography & videography', 'Entertainment & DJ setup'],
        },
        features: [
            { icon: '🎂', title: 'Custom Celebrations', description: 'From golden jubilees to surprise parties — we design celebrations that match your style and vision perfectly.' },
            { icon: '🎈', title: 'Themed Décor', description: 'Premium balloon arches, flower installations, custom backdrops, and fairy-light canopies tailored to your theme.' },
            { icon: '🎁', title: 'Surprise Planning', description: 'We coordinate with your guests secretly to plan epic surprise arrivals, gift reveals, and special moments.' },
            { icon: '🥂', title: 'Bar & Dining', description: 'Craft cocktail bars, wine tastings, and multi-course dinners designed for celebration.' },
        ],
        villas: [
            { name: 'The Grand Chateau', location: 'North Goa', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', guests: 16, beds: 8, slug: 'the-grand-chateau' },
            { name: 'The Ivory Manor', location: 'Kasauli, Himachal Pradesh', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop', guests: 8, beds: 4, slug: 'the-ivory-manor' },
            { name: 'Villa del Sol', location: 'Alibaug, Maharashtra', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop', guests: 12, beds: 6, slug: 'villa-del-sol' },
        ],
        services: [
            { name: 'Celebration Décor', description: 'Premium balloon installations, flower walls, and custom backdrops.', icon: '🎈', price: '₹15,000' },
            { name: 'Custom Cake & Desserts', description: 'Designer cakes and dessert tables crafted to your theme.', icon: '🎂', price: '₹8,000' },
            { name: 'Private Bar & Mixologist', description: 'Craft cocktails, mocktails, and a curated drinks menu.', icon: '🍸', price: '₹12,000' },
            { name: 'DJ & Sound System', description: 'Professional sound setup with DJ for the perfect party vibe.', icon: '🎧', price: '₹18,000' },
            { name: 'Fireworks Display', description: 'Licensed fireworks display to cap off the celebration.', icon: '🎆', price: '₹30,000' },
        ],
        timeline: [
            { step: 1, title: 'Tell Us the Occasion', description: 'Birthday, anniversary, reunion? Share the details and your dream vision.' },
            { step: 2, title: 'Custom Design', description: 'Our events team creates a tailored celebration plan with décor themes and entertainment.' },
            { step: 3, title: 'Secret Coordination', description: 'We work behind the scenes to perfect every surprise element and guest arrangement.' },
            { step: 4, title: 'Celebrate!', description: 'Walk into a fully transformed villa and create memories that last a lifetime.' },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1496843916299-590492c751f4?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop',
        ],
        testimonials: [
            { quote: 'My wife had no idea! StayXL planned the entire surprise 40th — the décor, the chef, even flew in her sister. Absolutely worth every penny.', name: 'Vikram S.', type: 'Surprise Birthday' },
            { quote: 'We celebrated our 25th anniversary at Villa del Sol and it was pure magic. The candlelit dinner by the pool was unforgettable.', name: 'Sunita & Raj', type: 'Anniversary' },
            { quote: 'Graduated from IIM and my friends booked the whole villa through StayXL. Best graduation party ever — the bonfire and DJ were epic!', name: 'Aditya P.', type: 'Graduation Party' },
        ],
        faqs: [
            { q: 'Can you plan a surprise celebration?', a: 'Yes! We specialize in surprise coordination. Share the details and we\'ll handle everything discreetly — from secret guest arrivals to the big reveal.' },
            { q: 'What celebration types do you support?', a: 'Birthdays, anniversaries, engagements, graduation parties, reunions, bachelor/bachelorette weekends, and any milestone you want to celebrate.' },
            { q: 'How far in advance should I book?', a: 'We recommend at least 2–4 weeks for celebrations. For elaborate setups or peak seasons, 6–8 weeks is ideal.' },
            { q: 'Can I bring my own vendors?', a: 'Absolutely! You\'re welcome to bring your own DJ, photographer, or caterer. We\'ll coordinate access and logistics.' },
            { q: 'Are late-night celebrations allowed?', a: 'Music is allowed until 10 PM outdoors (per local regulations). Indoor celebrations can continue later. We\'ll brief you on property-specific rules.' },
        ],
        ctaHeadline: 'Plan Your Celebration',
        ctaSubtext: 'Let our events team help you create the most memorable celebration of your life.',
    },

    /* ─────────────────── WELLNESS ─────────────────── */
    wellness: {
        slug: 'wellness',
        caption: 'Wellness Retreat Experiences',
        heading: 'Find Your Inner Peace',
        subtext: 'Restore, rejuvenate, and reconnect with yourself in serene private sanctuaries.',
        heroImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
        heroVideo: null,
        intro: {
            image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop',
            heading: 'Slow Down. Breathe. Reset.',
            description: 'Our wellness retreats are designed for those who seek more than a vacation. Set in nature\'s most calming landscapes, each retreat combines expert-led yoga, meditation, Ayurvedic treatments, and nourishing cuisine to help you return to yourself.',
            highlights: ['Certified yoga & meditation instructors', 'Ayurvedic spa & body treatments', 'Organic plant-based cuisine', 'Silent meditation rooms', 'Nature walks & forest bathing'],
        },
        features: [
            { icon: '🧘', title: 'Yoga & Meditation', description: 'Daily sessions led by certified instructors — from sunrise Vinyasa to evening Yin, tailored to your level.' },
            { icon: '🌿', title: 'Ayurvedic Treatments', description: 'Personalized Ayurvedic consultations, Abhyanga massage, Shirodhara, and herbal therapies.' },
            { icon: '🥗', title: 'Nourishing Cuisine', description: 'Sattvic meals, cold-pressed juices, and superfood bowls prepared by our wellness chef.' },
            { icon: '🌳', title: 'Nature Immersion', description: 'Forest bathing, guided nature walks, bird watching, and outdoor meditation in serene surroundings.' },
        ],
        villas: [
            { name: 'Woodland Retreat', location: 'Coorg, Karnataka', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop', guests: 4, beds: 2, slug: 'woodland-retreat' },
            { name: 'The Ivory Manor', location: 'Kasauli, Himachal Pradesh', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop', guests: 8, beds: 4, slug: 'the-ivory-manor' },
            { name: 'Serenity Heights', location: 'Lonavala, Maharashtra', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop', guests: 6, beds: 3, slug: 'serenity-heights' },
        ],
        services: [
            { name: 'Personal Yoga Instructor', description: '1-on-1 or group sessions, customized to your practice level.', icon: '🧘', price: '₹5,000/session' },
            { name: 'Ayurvedic Spa Package', description: 'Full-day Ayurvedic treatment with consultation, massage, and herbal steam.', icon: '💆', price: '₹12,000' },
            { name: 'Wellness Chef', description: 'Sattvic, vegan, or customized wellness meals for your entire stay.', icon: '🥗', price: '₹4,000/day' },
            { name: 'Sound Healing Session', description: 'Tibetan singing bowls and gong meditation for deep relaxation.', icon: '🔔', price: '₹3,500' },
            { name: 'Guided Nature Walk', description: 'Early morning forest bathing or bird-watching trail with a local guide.', icon: '🌿', price: '₹2,000' },
        ],
        timeline: [
            { step: 1, title: 'Share Your Goals', description: 'Tell us what you seek — stress relief, detox, spiritual growth, or simply slowing down.' },
            { step: 2, title: 'Personalized Retreat Plan', description: 'Our wellness coordinator designs a daily schedule with yoga, meals, treatments, and rest.' },
            { step: 3, title: 'Prepare Your Space', description: 'We set up the villa with meditation corners, yoga mats, essential oils, and wellness amenity kits.' },
            { step: 4, title: 'Retreat & Restore', description: 'Disconnect from the noise and reconnect with yourself in nature\'s embrace.' },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
        ],
        testimonials: [
            { quote: 'Three days at Woodland Retreat with daily yoga and Ayurvedic meals completely reset my system. I returned to work feeling like a new person.', name: 'Kavya R.', type: 'Solo Wellness Retreat' },
            { quote: 'My husband and I did a couples retreat at Serenity Heights. The sound healing session by the pool at sunset — absolutely transcendent.', name: 'Deepa & Suresh', type: 'Couples Retreat' },
            { quote: 'As someone with chronic back pain, the personalized yoga and massage sessions were transformative. The instructor was world-class.', name: 'Amit T.', type: 'Therapeutic Retreat' },
        ],
        faqs: [
            { q: 'Do I need prior yoga experience?', a: 'Not at all! Our instructors customize sessions for all levels — from complete beginners to advanced practitioners.' },
            { q: 'What kind of food is served?', a: 'Our wellness menus are primarily Sattvic, plant-based, and Ayurvedic. We accommodate dietary restrictions and can adjust to your preferences.' },
            { q: 'Can I do a solo retreat?', a: 'Absolutely. Many of our guests come alone seeking solitude. We design solo retreat itineraries with ample personal space and silence.' },
            { q: 'How long should a wellness retreat be?', a: 'We recommend 3–5 nights for a meaningful reset. Weekend retreats (2 nights) work well for shorter getaways.' },
            { q: 'Is Wi-Fi available?', a: 'Yes, Wi-Fi is available but we encourage digital detox. We can provide a "digital wellness" plan if you\'d like to unplug intentionally.' },
        ],
        ctaHeadline: 'Begin Your Wellness Journey',
        ctaSubtext: 'Our wellness coordinators will craft the perfect retreat for your body, mind, and soul.',
    },
};

export default experienceData;
