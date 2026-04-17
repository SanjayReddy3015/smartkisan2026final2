import { GoogleGenerativeAI } from "@google/generative-ai";

export const ai = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY || ""
);

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
  mr: "Marathi",
  gu: "Gujarati",
  pa: "Punjabi",
  bn: "Bengali",
  ml: "Malayalam",
  or: "Odia",
};

export async function askFarmingQuestion(message: string, language = "en"): Promise<string> {
  try {
    const langName = LANGUAGE_MAP[language] || "English";
    const prompt = `You are SmartKisan, an expert AI agricultural advisor for Indian farmers. 
You have deep knowledge of:
- All Indian crops (Rabi, Kharif, Zaid) and their cultivation practices
- Indian Mandi market prices and government schemes (PM-KISAN, NABARD, MSP)
- Indian soil types, irrigation methods, and fertilizer recommendations
- Pest & disease management for Indian conditions
- Local Indian agricultural policies and FPO guidance

IMPORTANT: Respond ONLY in ${langName} language. Keep your answer concise, practical and farmer-friendly.
If asked in a different language, still reply in ${langName}.

Farmer's question: ${message}`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (err: any) {
    console.error("Gemini API Error in askFarmingQuestion:", err);
    return "I am having trouble connecting right now (Quota Exceeded or Invalid API Key). Please verify your GEMINI_API_KEY.";
  }
}

export async function getIrrigationAdvice(cropType: string, soilType: string, temperature: number): Promise<{ recommendation: string; waterLitersPerAcre: number }> {
  try {
    const prompt = `You are an Indian agricultural irrigation expert.
Crop: ${cropType}, Soil: ${soilType}, Temperature: ${temperature}°C

Give a concise irrigation recommendation for this Indian crop including:
1. Watering frequency and amount
2. Best irrigation method (drip/flood/sprinkler)
3. Critical growth stages needing extra water
4. Water-saving tips

Also estimate total water requirement in liters per acre per week.
Reply in JSON format: { "recommendation": "...", "waterLitersPerAcre": <number> }`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { recommendation: text, waterLitersPerAcre: 45000 };
  } catch (err) {
    console.error("Irrigation AI error:", err);
    return { recommendation: "Apply water every 3-4 days (API key exhausted).", waterLitersPerAcre: 45000 };
  }
}

export async function getFertilizerAdvice(cropType: string, soilType: string, stage: string): Promise<{ recommendation: string }> {
  try {
    const prompt = `You are an Indian fertilizer and soil nutrition expert.
Crop: ${cropType}, Soil Type: ${soilType}, Growth Stage: ${stage}

Provide a detailed fertilizer recommendation including:
1. Specific fertilizer names available in India (DAP, Urea, NPK grades, etc.)
2. Application rate per acre
3. Application timing and method
4. Micronutrient supplements if needed
5. Organic alternatives

Be specific to Indian market availability and farmer budget.`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);
    return { recommendation: response.response.text() };
  } catch (err) {
    console.error("Fertilizer AI error:", err);
    return { recommendation: "Apply NPK 10-26-26 at sowing. (API limit reached)" };
  }
}

export async function getTransportEstimate(from: string, to: string, cropType: string, quantity: number): Promise<{ cost: number; distance: string; tips: string }> {
  try {
    const prompt = `You are an Indian rural logistics expert with knowledge of truck rental rates across India.
From: ${from}, To: ${to} (both in India)
Crop: ${cropType}, Quantity: ${quantity} quintals

Estimate:
1. Approximate road distance
2. Transport cost in INR (₹) using current Indian trucking rates (mini-truck, medium, large)
3. Best transport option for this quantity
4. Tips to reduce transport cost in India

Reply in JSON: { "cost": <number in rupees>, "distance": "<km range>", "tips": "..." }`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { cost: quantity * 15, distance: "100 km", tips: "Use localized transport." };
  } catch (err) {
    return { cost: Math.round(quantity * 15), distance: "50-100 km", tips: "Book trucks through local FPO. (API limit)" };
  }
}

export async function getCropWeatherAlert(crop: string, weatherData: any): Promise<string> {
  try {
    const prompt = `You are an Indian crop weather advisory expert.
Crop being grown: ${crop}
Current weather: Temperature ${weatherData.temp}°C, Humidity ${weatherData.humidity}%, Condition: ${weatherData.condition}

Based on this weather, give:
1. Immediate crop protection advice
2. Alert level (Safe/Caution/Warning/Danger)
3. Specific actions farmer should take today
4. Pest/disease risk given this weather

Keep it brief and actionable for Indian farmers.`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (err) {
    return "Monitor your crops regularly and ensure proper drainage (API limit reached).";
  }
}
