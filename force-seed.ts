import { db } from "./server/db";
import { products } from "./shared/schema";
import { storage } from "./server/storage";

async function run() {
    await db.delete(products);
    console.log("Cleared old basic products...");

    const seedProducts = [
        { name: "Premium Neem Oil (Cold Pressed)", category: "Pesticides", price: 350, imageUrl: "https://images.unsplash.com/photo-1620864383182-3e2840049f50?w=400&q=80", description: "100% Organic Neem Oil for plants and crops.", usage: "Mix 5ml of neem oil + 1ml liquid soap in 1L water. Spray heavily on leaves during evening.", benefits: "Naturally repels aphids, mealybugs, and whiteflies without harming earthworms or bees.", buyUrl: "https://www.amazon.in/s?k=neem+oil+for+plants" },
        { name: "Drip Irrigation Kit (0.5 Acre)", category: "Tools", price: 4500, imageUrl: "https://images.unsplash.com/photo-1605330379124-7eb326880bd4?w=400&q=80", description: "Complete drip line set with emitters, pipe connectors, and lateral rolls.", usage: "Connect main pipe to pump. Lay lateral lines along crop rows ensuring emitter is near the root zone.", benefits: "Saves up to 70% water, reduces weeds, and ensures uniform fertilizer distribution.", buyUrl: "https://www.amazon.in/s?k=drip+irrigation+kit+agriculture" },
        { name: "Organic Seaweed Extract Fertilizer", category: "Fertilizers", price: 499, imageUrl: "https://images.unsplash.com/photo-1627997931327-0cc69bfd7915?w=400&q=80", description: "Liquid seaweed extract bio-stimulant for rapid growth.", usage: "Foliar spray: 2-3 ml per liter of water. Soil application: 5 ml per liter. Apply every 15 days.", benefits: "Enhances flowering, prevents fruit drop, and builds frost resistance in winter crops.", buyUrl: "https://www.amazon.in/s?k=seaweed+extract+fertilizer" },
        { name: "Solar Powered Animal Repeller", category: "Tools", price: 1299, imageUrl: "https://images.unsplash.com/photo-1592860882101-ca1887e5bced?w=400&q=80", description: "Ultrasonic sensor repeller preventing nilgai, wild boars, and stray cattle.", usage: "Stake it into the ground facing crop boundaries. Ensure panel gets direct sunlight.", benefits: "Chemical-free crop protection, zero electricity bill, triggers flashing lights at night.", buyUrl: "https://www.amazon.in/s?k=solar+animal+repeller" },
        { name: "High Yield Tomato Seeds (Hybrid)", category: "Seeds", price: 290, imageUrl: "https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=400&q=80", description: "F1 Hybrid red tomato seeds suitable for polyhouse and open farming.", usage: "Sow in nursery beds. Transplant 25-day old seedlings at 60x45 cm spacing.", benefits: "High disease resistance (ToLCV), firm fruits perfect for long-distance transport.", buyUrl: "https://www.ugaoo.com/collections/tomato-seeds" },
        { name: "Manual Push Seeder & Fertilizer Combo", category: "Tools", price: 3200, imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80", description: "Two-barrel handy planter to sow seeds and drop fertilizer simultaneously.", usage: "Fill one box with seeds (maize/cotton) and other with DAP. Push along rows.", benefits: "Eliminates back-breaking labour, ensures perfect seed depth and seed-fertilizer distance.", buyUrl: "https://www.amazon.in/s?k=manual+seed+drill" }
    ];
    for (const p of seedProducts) {
        await storage.createProduct(p as any);
    }
    console.log("Seeded new rich products!");
}
run().catch(console.error).then(() => process.exit(0));
