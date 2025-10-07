import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const fetchStockInfo = async (ticker: string): Promise<string> => {
  if (!API_KEY) {
    return "API 金鑰未設定。請聯絡管理員。";
  }
  
  try {
    const prompt = `為代號為 ${ticker} 的美國股票提供一段簡短的摘要。重點介紹其主要業務、市場地位和近期表現。摘要應簡潔且對投資者有參考價值。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching stock info from Gemini API:", error);
    return `無法取得 $${ticker} 的資訊。API 可能無法使用或股票代號無效。`;
  }
};

export const validateTicker = async (ticker: string): Promise<boolean> => {
  if (!API_KEY) {
    console.error("API 金鑰未設定。");
    return false;
  }
  try {
    const prompt = `Is "${ticker}" a valid stock ticker symbol for a company listed on a major US stock exchange (like NYSE or NASDAQ)? Examples of valid tickers are AAPL, GOOGL. Respond with only the word "VALID" or "INVALID".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.1, 
      }
    });
    
    const textResponse = response.text.trim().toUpperCase();
    return textResponse.includes('VALID'); 
  } catch (error) {
    console.error(`Error validating ticker ${ticker}:`, error);
    return false;
  }
};