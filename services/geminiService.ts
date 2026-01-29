
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert nutritionist and AI food analyst for the "lvlup" health app. 
Your goal is to identify foods in an image, estimate their weight in grams, calories, and protein content.
Return a structured JSON response.
`;

export const analyzeFoodImage = async (base64Image: string): Promise<any> => {
  try {
    // Initializing GoogleGenAI inside the function to use the current process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

export const findNearbyPlaces = async (query: string, latitude: number, longitude: number) => {
  try {
    // Initializing GoogleGenAI inside the function to use the current process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find ${query} nearby my location. Provide a few options with names and descriptions.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude, longitude }
          }
        }
      },
    });

    const text = response.text || "No recommendations found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract URIs from grounding chunks
    const links = chunks
      .filter((c: any) => c.maps?.uri)
      .map((c: any) => ({
        title: c.maps.title,
        uri: c.maps.uri
      }));

    return { text, links };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Failed to find nearby places.", links: [] };
  }
};
