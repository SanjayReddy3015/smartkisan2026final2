/**
 * Agmarknet (data.gov.in) Real-Time Commodity Price Fetcher
 * API: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
 * Dataset: Daily Commodity Prices from AGMARKNET
 */

export interface AgmarknetRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

export interface AgmarknetResponse {
  total: number;
  count: number;
  limit: number;
  offset: number;
  records: AgmarknetRecord[];
}

export interface NormalizedPrice {
  state: string;
  market: string;
  crop: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: Date;
}

// Map of commodity synonyms to standard names
const COMMODITY_MAP: Record<string, string> = {
  "Wheat": "Wheat",
  "Paddy(Dhan)(Common)": "Paddy (Common)",
  "Paddy(Dhan)(Hybrid)": "Paddy (Hybrid)",
  "Cotton(Lint)": "Cotton",
  "Maize": "Maize",
  "Soyabean": "Soyabean",
  "Mustard": "Mustard",
  "Sugarcane": "Sugarcane",
  "Onion": "Onion",
  "Tomato": "Tomato",
  "Potato": "Potato",
  "Chilli(Dry)": "Dry Chilli",
  "Guar Seed(Cluster Bean Seed)": "Guar Seed",
  "Groundnut": "Groundnut",
  "Turmeric": "Turmeric",
  "Jowar(Sorghum)": "Jowar",
  "Bajra(Pearl Millet/Cumbu)": "Bajra",
  "Moong(Green Gram)": "Moong Dal",
  "Arhar (Tur/Red Gram)(Whole)": "Arhar Dal",
  "Urad Dal(Black Gram)": "Urad Dal",
  "Masoor Dal(Lentil)": "Masoor Dal",
  "Rice": "Rice",
  "Jute": "Jute",
  "Ragi (Finger Millet)": "Ragi",
};

const DEMO_API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571";
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

export async function fetchLiveMarketPrices(limit = 500): Promise<NormalizedPrice[]> {
  const apiKey = process.env.AGMARKNET_API_KEY || DEMO_API_KEY;
  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${apiKey}&format=json&limit=${limit}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Agmarknet API error: ${response.status} ${response.statusText}`);
  }

  const data: AgmarknetResponse = await response.json();

  const normalized: NormalizedPrice[] = [];

  for (const r of data.records) {
    const minPrice = parseInt(r.min_price?.replace(/,/g, "") || "0", 10);
    const maxPrice = parseInt(r.max_price?.replace(/,/g, "") || "0", 10);
    const modalPrice = parseInt(r.modal_price?.replace(/,/g, "") || "0", 10);

    if (!modalPrice || modalPrice <= 0) continue;

    // Parse date
    let date = new Date();
    if (r.arrival_date) {
      const parts = r.arrival_date.split("/");
      if (parts.length === 3) {
        date = new Date(`${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`);
      }
    }

    normalized.push({
      state: r.state || "Unknown",
      market: r.market || "Unknown",
      crop: COMMODITY_MAP[r.commodity] || r.commodity,
      variety: r.variety || "General",
      minPrice,
      maxPrice,
      modalPrice,
      date,
    });
  }

  return normalized;
}

/**
 * Generate realistic synthetic historical prices for the past 60 days
 * based on current prices (used when API doesn't return historical data).
 * Simulates realistic price fluctuations.
 */
export function generatePriceHistory(
  crop: string,
  state: string,
  market: string,
  variety: string,
  currentPrice: number,
  days = 60
): Array<{ date: string; minPrice: number; maxPrice: number; modalPrice: number }> {
  const history = [];
  let price = currentPrice * (0.85 + Math.random() * 0.1); // Start 10-15% lower

  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    // Simulate weekly market cycle + random noise
    const weeklyFactor = 1 + 0.02 * Math.sin((i / 7) * Math.PI);
    const noise = 1 + (Math.random() - 0.48) * 0.04;
    price = price * weeklyFactor * noise;

    const modal = Math.round(price);
    const spread = Math.round(modal * 0.05);

    history.push({
      date: dateStr,
      minPrice: modal - spread,
      maxPrice: modal + spread,
      modalPrice: modal,
    });
  }

  return history;
}
