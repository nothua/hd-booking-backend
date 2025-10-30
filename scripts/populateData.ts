import("dotenv");

import mongoose from 'mongoose';
import Experience, { IExperience } from '../src/models/Experience'; 
import Promo from '../src/models/Promo'
import Slot from '../src/models/Slot';

const generateSampleExperiences = (): Partial<IExperience>[] => {
    const experiences = [];

    const locations = ["Mountain Peak", "City Center", "Coastal Trail", "Historic Old Town", "National Forest", "Redwood Valley", "Sunset Bay", "Riverbend", "Skyview Point", "Downtown Plaza"];
    
    const descriptionTemplates = [
        "A curated small-group experience. Certified guide. Safety first with gear included. Join us for an unforgettable journey.",
        "Discover the hidden gems of the area with an expert local guide. This tour is perfect for photographers, foodies, and explorers alike.",
        "Experience the breathtaking beauty of this location. This is a comprehensive tour that covers all the major highlights and more.",
        "An immersive, hands-on experience designed for all skill levels. We provide everything you need to learn and have a great time.",
        "Join a small group of fellow adventurers on this exclusive tour. We keep our groups small to ensure a personal and high-quality experience."
    ];
    
    const aboutTemplates = [
        "Scenic routes, trained guides, and a mandatory safety briefing. Minimum age: 10. All equipment (helmets, life jackets, etc.) is provided.",
        "This is a 3-hour walking tour. Please wear comfortable shoes. All food and non-alcoholic beverages are included. Meets at the main square.",
        "We provide all necessary gear, including kayaks, paddles, and safety vests. No prior experience needed. Tour duration is approx 2.5 hours.",
        "Our workshop is led by a professional artist. All materials are included in the price. You'll take home your own completed masterpiece. Minimum age: 16.",
        "This is an all-day strenuous hike. Participants must be in good physical condition. Bring at least 2L of water and your own lunch. Minimum age: 18."
    ];

    for (let i = 1; i <= 10; i++) {
        const loc = locations[i % locations.length];
        const desc = descriptionTemplates[i % descriptionTemplates.length];
        const about = aboutTemplates[i % aboutTemplates.length];

        experiences.push({
            name: `${loc}`,
            description: `Offers a unique perspective on ${loc}.`,
            location: loc,
            price: Math.floor(Math.random() * 200) + 50, 
            image: `https://picsum.photos/seed/${loc}${i}/400/300`, 
            about: `We run this tour rain or shine. Please check the weather and dress appropriately.`,
            isActive: Math.random() < 0.85
        });
    }
    return experiences;
};

const generateSlotsForExperiences = (createdExperiences: IExperience[]) => {
    const allSlots = [];
    const times = ["07:00 am", "09:00 am", "11:00 am", "01:00 pm"];

    for (const exp of createdExperiences) {
        for (let day = 0; day < 7; day++) {
            const slotDate = new Date();
            slotDate.setDate(slotDate.getDate() + day);
            slotDate.setHours(0, 0, 0, 0);

            for (const time of times) {
                const capacity = Math.floor(Math.random() * 11) + 10; 
                const booked = Math.floor(Math.random() * (capacity + 1));
                const available = capacity - booked;

                let status: 'available' | 'low' | 'sold_out' = 'available';
                if (available === 0) status = 'sold_out';
                else if (available <= 5) status = 'low';

                allSlots.push({
                    experienceId: exp._id,
                    date: new Date(slotDate),
                    time,
                    capacity,
                    booked,
                    available,
                    status
                });
            }
        }
    }

    return allSlots;
};

const generateSamplePromos = () => {
    return [
        {
            code: 'SAVE10',
            discountType: 'percentage',
            discountValue: 10,
            isActive: true
        },
        {
            code: 'FLAT100',
            discountType: 'fixed',
            discountValue: 100,
            isActive: true
        }
    ];
};

const seedDatabase = async () => {
    console.log("Connecting to MongoDB...");
    try {
        await mongoose.connect(process.env.MONGO_URI || "");
        console.log("MongoDB connected successfully.");

        console.log("Clearing existing slots...");
        await Slot.deleteMany({});
        console.log("Clearing existing experiences...");
        await Experience.deleteMany({});
        console.log("Clearing existing promos...");
        await Promo.deleteMany({});
        console.log("Existing data cleared.");

        console.log("Generating sample experiences...");
        const sampleExperiences = generateSampleExperiences();
        const createdExperiences = await Experience.insertMany(sampleExperiences) as IExperience[];
        console.log(`Successfully inserted ${createdExperiences.length} experiences.`);

        console.log("Generating sample promos...");
        const samplePromos = generateSamplePromos();
        const createdPromos = await Promo.insertMany(samplePromos);
        console.log(`Successfully inserted ${createdPromos.length} promos.`);

        console.log("Generating slots for new experiences...");
        const slotsToCreate = generateSlotsForExperiences(createdExperiences);
        const createdSlots = await Slot.insertMany(slotsToCreate);
        console.log(`Successfully inserted ${createdSlots.length} slots.`);

        console.log("\nDatabase seeded successfully! 🌱");

    } catch (error) {
        console.error("Error seeding database:", error);
        // process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

// --- 4. RUN THE SCRIPT ---
seedDatabase();