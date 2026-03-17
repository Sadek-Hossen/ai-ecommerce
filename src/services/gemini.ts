import { GoogleGenAI } from "@google/genai";

// AI Studio automatically injects GEMINI_API_KEY into process.env.GEMINI_API_KEY
// In VS Code, you must add this to your .env file.
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getAIResponse = async (prompt: string) => {
  try {
    const model = "gemini-3-flash-preview";
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful assistant for a luxury fashion store. Answer questions about products, style tips, and order status politely.",
      },
    });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Something went wrong. Please try again later.";
  }
};
