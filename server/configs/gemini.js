import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt) {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      return response.text;
    } catch (error) {
      console.error(`Gemini API Error (Attempt ${attempt}/${maxRetries}):`, error);
      if (attempt === maxRetries) {
        throw new Error("Failed to generate content with Gemini after retries");
      }
      // Wait 1.5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

export default main;