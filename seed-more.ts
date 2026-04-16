import { storage } from "./server/storage.ts";
import { generatePriceHistory } from "./server/agmarknet.ts";

const INDIAN_CROPS_SEED = [
    { state: "Himachal Pradesh", market: "Shimla", crop: "Apple", variety: "Royal Delicious", minPrice: 5000, maxPrice: 9000, pricePerQuintal: 7000 },
    { state: "Gujarat", market: "Ahmedabad", crop: "Garlic", variety: "White", minPrice: 3000, maxPrice: 6000, pricePerQuintal: 4500 },
    { state: "Tamil Nadu", market: "Erode", crop: "Banana", variety: "Poovan", minPrice: 1200, maxPrice: 2000, pricePerQuintal: 1600 }
];

async function run() {
    try {
        const historyRecords: any[] = [];
        for (const seed of INDIAN_CROPS_SEED) {
            const history = generatePriceHistory(seed.crop, seed.state, seed.market, seed.variety || "General", seed.pricePerQuintal, 60);
            for (const h of history) {
                historyRecords.push({
                    crop: seed.crop,
                    state: seed.state,
                    market: seed.market,
                    variety: seed.variety || "General",
                    minPrice: h.minPrice,
                    maxPrice: h.maxPrice,
                    modalPrice: h.modalPrice,
                    recordDate: h.date,
                });
            }
        }
        await storage.insertPriceHistory(historyRecords);
        console.log("Seeded successfully");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
