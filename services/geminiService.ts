import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert nutritionist and AI food analyst for the "lvlup" health app. 
Your goal is to identify foods in an image, estimate their weight in grams, calories, and protein content.
Be as accurate as possible. If the food is complex (e.g., a curry), estimate the components.
Return a structured JSON response.
`;

export const analyzeFoodImage = async (base64Image: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this meal. Identify the items, estimated weight (g), calories (kcal), and protein (g)."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  weightG: { type: Type.NUMBER },
                  calories: { type: Type.NUMBER },
                  proteinG: { type: Type.NUMBER }
                },
                required: ["name", "weightG", "calories", "proteinG"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return { items: [] };
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};