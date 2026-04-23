import { villas } from '../data/villas';

export type Collection = {
  name: string;
  image: string;
  villas: any[];
  count: number | string;
};

const collectionImages: Record<string, string> = {
  "Party Villas": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800",
  "Private Pool Villas": "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
  "Large Group Villas": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800",
  "Birthday Villas": "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=800",
  "Bachelor Party Villas": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
  "Luxury Villas": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800",
  "Budget Villas": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800",
  "Weekend Getaway Villas": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800",
  "Couple Villas": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800",
  "Pet Friendly Villas": "https://images.unsplash.com/photo-1541591415600-9820bf58295b?q=80&w=800",
};

export function getVillasByCollection() {
  const result: Record<string, any[]> = {
    "Party Villas": [],
    "Private Pool Villas": [],
    "Large Group Villas": [],
    "Birthday Villas": [],
    "Bachelor Party Villas": [],
    "Luxury Villas": [],
    "Budget Villas": [],
    "Weekend Getaway Villas": [],
    "Couple Villas": [],
    "Pet Friendly Villas": [],
  };

  villas.forEach(villa => {
    const villaCollections: string[] = [];
    const guests = typeof villa.guests === 'number' ? villa.guests : parseInt(villa.guests);
    const price = villa.pricePerNight;
    const amenitiesStr = JSON.stringify(villa.amenities).toLowerCase();
    const tags = villa.tags.map(t => t.toLowerCase());

    // PARTY
    if (tags.includes('event friendly') || guests >= 10 || amenitiesStr.includes('music') || amenitiesStr.includes('lawn')) {
      villaCollections.push("Party Villas");
    }

    // PRIVATE POOL
    if (amenitiesStr.includes('pool')) {
      villaCollections.push("Private Pool Villas");
    }

    // LARGE GROUP
    if (guests >= 15 || villa.eventCapacity >= 100) {
      villaCollections.push("Large Group Villas");
    }

    // BIRTHDAY
    if (guests >= 8 && villaCollections.includes("Party Villas")) {
      villaCollections.push("Birthday Villas");
    }

    // BACHELOR
    if (villaCollections.includes("Party Villas") && villaCollections.includes("Private Pool Villas")) {
      villaCollections.push("Bachelor Party Villas");
    }

    // LUXURY
    if (price >= 25000 || tags.includes('luxury')) {
      villaCollections.push("Luxury Villas");
    }

    // BUDGET
    if (price <= 15000 || tags.includes('budget')) {
      villaCollections.push("Budget Villas");
    }

    // WEEKEND GETAWAY
    if (villa.location.toLowerCase().includes("hyderabad") || villa.location.toLowerCase().includes("outskirts")) {
      villaCollections.push("Weekend Getaway Villas");
    }

    // COUPLE
    if (guests <= 4) {
      villaCollections.push("Couple Villas");
    }

    // PET FRIENDLY
    if (amenitiesStr.includes('pet')) {
      villaCollections.push("Pet Friendly Villas");
    }

    // Assign villa to its collections
    villaCollections.forEach(col => {
      if (result[col]) result[col].push(villa);
    });
  });

  return Object.entries(result).map(([name, villas]) => ({
    name,
    image: collectionImages[name] || "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
    villas,
    count: villas.length > 0 ? villas.length : "Coming Soon"
  })).filter(col => col.count !== "Coming Soon" || ["Villas in Goa"].includes(col.name)); // Filter out empty ones except specific teasers
}
