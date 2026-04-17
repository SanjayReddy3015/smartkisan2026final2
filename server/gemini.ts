import { GoogleGenerativeAI, ChatSession, Content } from "@google/generative-ai";

// 1. Initialize the API
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY || ""
);

const LANGUAGE_MAP: Record<string, string> = {
  en: "English", hi: "Hindi", te: "Telugu", ta: "Tamil", kn: "Kannada",
  mr: "Marathi", gu: "Gujarati", pa: "Punjabi", bn: "Bengali", ml: "Malayalam", or: "Odia",
};

/**
 * 2. CHATBOT MANAGER
 * We use a Map to store chat sessions for different users so they have memory.
 */
const activeSessions = new Map<string, ChatSession>();

export async function runSmartKisanChat(
  userId: string, 
  message: string, 
  language = "en"
): Promise<string> {
  try {
    const langName = LANGUAGE_MAP[language] || "English";
    
    // System Instruction to define persona and rules
    const systemInstruction = `You are SmartKisan, an expert AI agricultural advisor for Indian farmers. 
    You have deep knowledge of Indian crops, Mandi prices, government schemes (PM-KISAN), and soil management.
    Respond ONLY in ${langName}. Keep answers concise, practical, and farmer-friendly.`;

    // Retrieve or create a session for this specific user
    let chatSession = activeSessions.get(userId);

    if (!chatSession) {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction // Sets the persona persistently
      });

      chatSession = model.startChat({
        history: [], // This is where memory lives
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7, // Balances creativity and factual accuracy
        },
      });
      activeSessions.set(userId, chatSession);
    }

    // Send the message to the model
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    
    return response.text();

  } catch (err: any) {
    console.error("Chatbot Error:", err);
    return "Kshama karein (Sorry), I am having trouble connecting. Please check your internet or API key.";
  }
}

/**
 * 3. SPECIALIZED ANALYSIS TOOLS 
 * (Updated to use the newer SDK patterns)
 */

export async function getIrrigationAdvice(cropType: string, soilType: string, temperature: number): Promise<any> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Act as an Indian irrigation expert. 
  Provide JSON only: { "recommendation": "string", "waterLitersPerAcre": number }.
  Context: Crop ${cropType}, Soil ${soilType}, Temp ${temperature}°C.`;

  try {
    const result = await model.generateContent(prompt);
    // Safety check for JSON parsing
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (err) {
    return { recommendation: "Apply water manually. Error fetching data.", waterLitersPerAcre: 40000 };
  }
}

// ... Repeat similar logic for Fertilizer and Transport to keep them as "Tools"
