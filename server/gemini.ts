// SmartKisan AI Service — powered by Anthropic Claude API
// Replaces: @google/generative-ai (Gemini)
// Requires: ANTHROPIC_API_KEY in your .env file

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const CLAUDE_MODEL = "claude-sonnet-4-20250514"; // Best balance of speed + quality
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

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
};

// ─── Core helper: call Claude API ────────────────────────────────────────────

async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1024
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set in environment variables.");
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  // Claude returns content as an array of blocks
  const textBlock = data.content?.find((b: any) => b.type === "text");
  return textBlock?.text ?? "";
}

// ─── 1. Chat / Farming Q&A ────────────────────────────────────────────────────

export async function askFarmingQuestion(
  message: string,
  language = "en"
): Promise<string> {
  const langName = LANGUAGE_MAP[language] || "English";

  const system = `Act as SmartKisan, a Senior AI Agricultural Scientist and specialized consultant for Indian farmers.
Your goal is to provide comprehensive, scientifically-grounded, and highly informative advice that addresses EVERY detail of the farmer's query.

FORMATTING RULES:
1. Use Markdown for structure: # or ## for headings, - for bullets, **bold** for critical terms.
2. Provide step-by-step guides for any process (sowing, pruning, pest control).
3. Be region-specific: tailor advice to local soil, weather, and tradition when a region is mentioned.
4. Include brief scientific reasoning (e.g., why a fertilizer is recommended).

EXPERTISE AREAS:
- Detailed cultivation practices for Rabi, Kharif, and Zaid crops.
- Modern irrigation (Drip, Sprinkler) vs Traditional methods.
- Integrated Pest Management (IPM) and organic alternatives (Neem oil, Dashparni).
- Market dynamics: MSP, FPO benefits, government schemes (PM-Kisan, KCC).
- Soil health based on Indian NPK standards.

STRICT LANGUAGE RULE: Respond ONLY in ${langName}. If the question is in another language, translate your expert knowledge and reply in ${langName}.`;

  try {
    return await callClaude(system, message, 1500);
  } catch (error: any) {
    console.error("Claude API Error (askFarmingQuestion):", error.message);
    return getChatFallback(message, language);
  }
}

// ─── 2. Irrigation Advice ─────────────────────────────────────────────────────

export async function getIrrigationAdvice(
  cropType: string,
  soilType: string,
  temperature: number
): Promise<{ recommendation: string; waterLitersPerAcre: number }> {
  const system = `You are SmartKisan AI, an expert agricultural advisor for Indian farmers.
Always reply with ONLY a valid JSON object — no preamble, no markdown fences.
Required format: { "recommendation": "<string>", "waterLitersPerAcre": <integer> }`;

  const userMessage = `Provide irrigation advice for ${cropType} grown in ${soilType} soil at a temperature of ${temperature}°C.
Consider Indian farming conditions and water availability constraints.`;

  try {
    const raw = await callClaude(system, userMessage, 400);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Response was not valid JSON");
  } catch (err: any) {
    console.error("Claude API Error (getIrrigationAdvice):", err.message);
    // Algorithmic fallback
    const crop = (cropType || "").toLowerCase();
    const soil = (soilType || "").toLowerCase();
    const isDry = soil.includes("sand") || temperature > 30;
    const baseWater = crop.includes("rice")
      ? 5000
      : crop.includes("wheat")
      ? 3000
      : 2000;
    return {
      recommendation: `Based on your ${soilType} soil and ${temperature}°C temperature, a ${
        isDry ? "frequent" : "moderate"
      } irrigation schedule is recommended for ${cropType}.`,
      waterLitersPerAcre: Math.round(baseWater * (isDry ? 1.4 : 1.0)),
    };
  }
}

// ─── 3. Fertilizer Advice ─────────────────────────────────────────────────────

export async function getFertilizerAdvice(
  cropType: string,
  soilType: string,
  stage: string
): Promise<{ recommendation: string }> {
  const system = `You are SmartKisan AI, an expert agricultural advisor for Indian farmers.
Recommend fertilizers that are widely available in Indian markets and suited to smallholder budgets.
Use Markdown formatting with bullet points for clarity.`;

  const userMessage = `Recommend the best fertilizer plan for ${cropType} growing in ${soilType} soil at the ${stage} crop stage.
Include NPK ratios, application methods, and timing.`;

  try {
    const text = await callClaude(system, userMessage, 600);
    return { recommendation: text };
  } catch (err: any) {
    console.error("Claude API Error (getFertilizerAdvice):", err.message);
    const phase = (stage || "").toLowerCase();
    let advice = `For ${cropType} at ${stage} stage: `;
    if (phase.includes("sow") || phase.includes("basal")) {
      advice += "Apply a Basal dose of NPK (12:32:16) or DAP with Muriate of Potash.";
    } else if (phase.includes("vegetative") || phase.includes("growth")) {
      advice += "Top-dress with Urea (Nitrogen) to encourage foliage and height.";
    } else {
      advice +=
        "Ensure sufficient Potassium and Micronutrients for grain filling and quality.";
    }
    return { recommendation: advice };
  }
}

// ─── 4. Transport Cost Estimate ───────────────────────────────────────────────

export async function getTransportEstimate(
  from: string,
  to: string,
  weight: number
): Promise<{ cost: number; distance: string; tips: string }> {
  const system = `You are SmartKisan AI, a logistics expert for Indian agricultural supply chains.
Always reply with ONLY a valid JSON object — no preamble, no markdown fences.
Required format: { "cost": <integer in INR>, "distance": "<string>", "tips": "<string>" }`;

  const userMessage = `Estimate the road transport cost for ${weight} metric tonnes of agricultural produce from ${from} to ${to} in India.
Include realistic 2025 trucking rates.`;

  try {
    const raw = await callClaude(system, userMessage, 400);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Response was not valid JSON");
  } catch (err: any) {
    console.error("Claude API Error (getTransportEstimate):", err.message);
    const distanceVal =
      (from.length + to.length) * 15 + weight * 5;
    const costPerKm = weight > 5 ? 12 : 8;
    return {
      cost: distanceVal * costPerKm,
      distance: `${distanceVal} km (estimated)`,
      tips:
        "Compare rates on Vahak or BlackBuck. Ensure proper tarp cover during monsoon transport.",
    };
  }
}

// ─── 5. Yield & Profit Estimate ───────────────────────────────────────────────

export async function getYieldEstimate(
  cropType: string,
  acres: number,
  expectedPrice: number
): Promise<{ estimatedYieldQuintals: number; estimatedProfit: number }> {
  const system = `You are SmartKisan AI, an agricultural economics expert for Indian farmers.
Always reply with ONLY a valid JSON object — no preamble, no markdown fences.
Required format: { "estimatedYieldQuintals": <integer>, "estimatedProfit": <integer> }`;

  const userMessage = `Estimate the expected yield in quintals and net profit (in INR) for ${acres} acres of ${cropType}.
Assume the farmer receives ₹${expectedPrice} per quintal. Use realistic Indian average yield data.`;

  try {
    const raw = await callClaude(system, userMessage, 300);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Response was not valid JSON");
  } catch (err: any) {
    console.error("Claude API Error (getYieldEstimate):", err.message);
    const estimatedYield =
      acres * (cropType.toLowerCase().includes("rice") ? 22 : 15);
    return {
      estimatedYieldQuintals: estimatedYield,
      estimatedProfit: estimatedYield * expectedPrice,
    };
  }
}

// ─── 6. Crop Weather Alert ────────────────────────────────────────────────────

export async function getCropWeatherAlert(
  crop: string,
  location: string
): Promise<string> {
  const system = `You are SmartKisan AI, a crop advisory expert for Indian farmers.
Give a concise 2–3 line weather-related advisory. Be specific and actionable.`;

  const userMessage = `What weather precautions should a farmer growing ${crop} near ${location} take right now, based on typical seasonal patterns for that region?`;

  try {
    return await callClaude(system, userMessage, 200);
  } catch (err: any) {
    console.error("Claude API Error (getCropWeatherAlert):", err.message);
    return `No active alerts for ${crop}. Keep soil moist during dry spells and ensure drainage is clear.`;
  }
}

// ─── Keyword-based offline fallback (unchanged) ───────────────────────────────

function getChatFallback(message: string, lang = "en"): string {
  const msg = message.toLowerCase();

  const fallbacks: Record<string, Record<string, string>> = {
    wheat: {
      en: "## Wheat (Rabi Crop) Cultivation\n- **Sowing Period:** November to December is ideal.\n- **Preparation:** Soil should be well-pulverized. Use heavy pre-sowing irrigation.\n- **Key Phase:** The CRI (Crown Root Initiation) stage @ 21 days is critical for irrigation.\n- **Fertilizer:** Standard N:P:K ratio of 120:60:40 kg/ha is generally recommended for high yield.",
      hi: "## गेहूँ (रबी फसल) की खेती\n- **बुवाई का समय:** नवंबर से दिसंबर आदर्श है।\n- **तैयारी:** मिट्टी अच्छी तरह से भुरभुरी होनी चाहिए।\n- **महत्वपूर्ण चरण:** 21 दिनों पर CRI (क्राउन रूट इनिशिएशन) चरण सिंचाई के लिए महत्वपूर्ण है।",
    },
    rice: {
      en: "## Rice/Paddy (Kharif Staple)\n- **Water Management:** Maintain 2-5 cm of standing water during the vegetative phase.\n- **Fertilizer:** Apply Nitrogen in 3 splits: Basal, Tillering, and Panicle initiation.\n- **Protection:** Watch for Brown Plant Hopper (BPH). Use Neem-based sprays for early organic control.",
      hi: "## चावल/धान (खरीफ मुख्य फसल)\n- **जल प्रबंधन:** वानस्पतिक चरण के दौरान 2-5 सेमी खड़े पानी को बनाए रखें।\n- **उर्वरक:** नाइट्रोजन को split खुराक में दें: बेसल, टिलरिंग और पैनिकल दीक्षा।",
    },
    cotton: {
      en: "## Cotton (White Gold) Management\n- **Soil Type:** Best suited for Black Cotton Soil (Regur) which retains moisture.\n- **Pests:** Bt Cotton helps against Bollworm, but watch for Sucking Pests (Aphids, Jassids).\n- **Yield Tip:** Judicious use of Growth Regulators like NAA can reduce flower drop.",
      hi: "## कपास प्रबंधन\n- **मिट्टी का प्रकार:** काली कपास मिट्टी (रेगुर) के लिए सबसे उपयुक्त।\n- **कीट:** बीटी कपास बोलवर्म के खिलाफ मदद करता है, लेकिन चूसने वाले कीटों पर नज़र रखें।",
    },
    pest: {
      en: "## Integrated Pest Management (IPM)\n1. **Cultural:** Use crop rotation and trap crops (like Marigold with Tomato).\n2. **Biological:** Use Pheromone traps and Trichogramma cards.\n3. **Chemical:** Use only as a last resort. For sucking pests, use Imidacloprid strictly per dosage.\n4. **Organic:** Spray 5% Neem Seed Kernel Extract (NSKE).",
      hi: "## एकीकृत कीट प्रबंधन (IPM)\n1. **सांस्कृतिक:** फसल चक्र और ट्रैप फसलों का उपयोग करें।\n2. **जैविक:** फेरोमोन ट्रैप और ट्राइकोग्रामा कार्ड का उपयोग करें।\n3. **जैविक:** 5% नीम बीज गिरी अर्क (NSKE) का छिड़काव करें।",
    },
    msp: {
      en: "## MSP (Minimum Support Price) Guidance\n- **What it is:** A guaranteed price at which the government buys crops from farmers.\n- **Key Crops:** MSP is announced for 23 mandated crops including Wheat, Paddy, Pulses, and Oilseeds.\n- **Tip:** Check the latest MSP notification on the Agmarknet portal.",
      hi: "## MSP (न्यूनतम समर्थन मूल्य) मार्गदर्शन\n- **यह क्या है:** एक गारंटीकृत मूल्य जिस पर सरकार किसानों से फसल खरीदती है।\n- **मुख्य फसलें:** 23 फसलों के लिए MSP घोषित किया जाता है।",
    },
    loan: {
      en: "## KCC & Farm Credit Systems\n- **KCC:** The Kisan Credit Card offers low-interest loans (3-4% with timely repayment).\n- **Application:** Carry your Land Records (Pahani/7-12 extract) and ID proof to your bank.\n- **Insurance:** KCC is often linked with PM Fasal Bima Yojana.",
      hi: "## KCC और कृषि ऋण प्रणाली\n- **KCC:** किसान क्रेडिट कार्ड कम ब्याज वाले ऋण (3-4%) प्रदान करता है।\n- **आवेदन:** अपने भूमि रिकॉर्ड और पहचान प्रमाण के साथ बैंक जाएं।",
    },
    default: {
      en: "I am SmartKisan AI (powered by Claude). I can provide detailed advice on **Wheat, Rice, Cotton, IPM/Pests, Loans, and government schemes like MSP**.\n\nPlease ensure your `ANTHROPIC_API_KEY` is correctly set in your `.env` file for full AI responses.",
      hi: "मैं स्मार्टकिसान एआई हूँ (Claude द्वारा संचालित)। मैं **गेहूँ, चावल, कपास, कीट प्रबंधन, ऋण और एमएसपी** पर विस्तृत सलाह दे सकता हूँ।\n\nपूर्ण AI उत्तरों के लिए कृपया अपनी `.env` फ़ाइल में `ANTHROPIC_API_KEY` सही तरह से सेट करें।",
    },
  };

  const l = lang === "hi" ? "hi" : "en";

  if (msg.includes("wheat") || msg.includes("gehu")) return fallbacks.wheat[l];
  if (msg.includes("rice") || msg.includes("dhan") || msg.includes("paddy"))
    return fallbacks.rice[l];
  if (msg.includes("cotton") || msg.includes("kapas"))
    return fallbacks.cotton[l];
  if (
    msg.includes("pest") ||
    msg.includes("insect") ||
    msg.includes("keeda")
  )
    return fallbacks.pest[l];
  if (
    msg.includes("msp") ||
    msg.includes("price") ||
    msg.includes("rate")
  )
    return fallbacks.msp[l];
  if (
    msg.includes("loan") ||
    msg.includes("karz") ||
    msg.includes("credit")
  )
    return fallbacks.loan[l];

  return fallbacks.default[l];
}
