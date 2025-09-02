import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Use a valid model name
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    // Return the generated text instead of just logging it
    return response.text;
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content with Gemini");
  }
}

export default main;