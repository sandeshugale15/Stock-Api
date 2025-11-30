import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getMarketAnalysis = async (symbol: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    return {
      text: "API Key is missing. Please configure your environment variables.",
      sources: []
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Give me a concise, real-time market analysis for ${symbol}. 
      Include the current price if available, recent news, and a brief outlook (Bullish/Bearish). 
      Keep it under 150 words. Focus on why it is moving today.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No analysis available.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Failed to fetch market analysis. Please try again later.",
      sources: []
    };
  }
};

export const searchStockSymbol = async (query: string): Promise<string[]> => {
    // A helper to find symbols if needed, simplified for this demo to just return the query if valid-ish
    // In a real app, this might use Gemini to fuzzy match company names to tickers
    return [query.toUpperCase()]; 
};
