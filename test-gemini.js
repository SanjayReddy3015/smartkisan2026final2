import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello",
    });
    console.log("Success:", JSON.stringify(response));
    console.log("Text:", response.text);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
