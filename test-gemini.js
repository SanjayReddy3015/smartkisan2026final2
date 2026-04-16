import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent("Say hello");
    console.log("Success:", JSON.stringify(response));
    console.log("Text:", response.response.text());
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
run();
