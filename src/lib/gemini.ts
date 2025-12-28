// @/lib/gemini.ts
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are FinSakhi — a friendly, knowledgeable financial companion for rural women in India.

IMPORTANT INSTRUCTIONS:
1. Respond in the SAME LANGUAGE as the user's question (English/Hindi/Tamil)
2. Keep answers clear, simple, and practical
3. Focus on empowering women with financial knowledge
4. Never ask for sensitive information (PIN, OTP, Aadhaar, passwords)
5. Provide step-by-step guidance when explaining procedures
6. Use examples that rural women can relate to
7. Be encouraging and supportive

Topics you can help with:
- Banking basics (opening accounts, using ATMs)
- UPI and digital payments
- Savings schemes and investments
- Government schemes for women
- Loan information
- Financial planning
- Safety tips for digital transactions

Always end with a helpful suggestion or next step.`;

export class GeminiChatService {
  private apiKey: string;
  private model = "gemini-1.5-flash"; // Use a valid model name

  constructor() {
    this.apiKey = apiKey;
    if (!this.apiKey) {
      console.error("⚠️ Gemini API key is missing! Please add VITE_GEMINI_API_KEY to .env");
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Gemini API key is not configured. Please check your .env file.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    // Detect language for better response
    const isHindi = /[\u0900-\u097F]/.test(message);
    const isTamil = /[\u0B80-\u0BFF]/.test(message);
    
    const languageHint = isHindi ? "Respond in Hindi." : 
                        isTamil ? "Respond in Tamil." : 
                        "Respond in English.";

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}

${languageHint}

User's question: ${message}

Please provide a helpful, detailed response in the appropriate language:`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    try {
      console.log("🤖 Sending to Gemini:", message.substring(0, 100) + "...");
      
      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("❌ Gemini API error:", data);
        
        // Provide helpful error messages
        if (response.status === 400) {
          throw new Error("Invalid request to AI service. Please check your API key.");
        } else if (response.status === 429) {
          // Extract retry time from error message if available
          const retryMatch = data.error?.message?.match(/(\d+\.\d+)s/);
          const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30;
          throw new Error(`Rate limit exceeded. Please wait ${retrySeconds} seconds and try again.`);
        } else if (response.status === 500) {
          throw new Error("AI service is currently unavailable. Please try again later.");
        } else {
          throw new Error(`AI service error: ${data.error?.message || "Unknown error"}`);
        }
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        console.error("❌ No text in response:", data);
        throw new Error("AI response was empty. Please try again.");
      }

      console.log("✅ Gemini response received");
      return text.trim();

    } catch (error: any) {
      console.error("❌ Gemini fetch failed:", error);
      
      // Fallback responses in different languages
      const isHindi = /[\u0900-\u097F]/.test(message);
      const isTamil = /[\u0B80-\u0BFF]/.test(message);
      
      if (isHindi) {
        return "माफ़ कीजिए, मुझे इस समय जवाब देने में समस्या हो रही है। कृपया थोड़ी देर बाद फिर से प्रयास करें। आप नीचे दिए गए सवालों में से किसी एक को ट्राई कर सकते हैं।";
      } else if (isTamil) {
        return "மன்னிக்கவும், இப்போது பதில் அளிப்பதில் சிக்கல் உள்ளது. தயவு செய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும். கீழே உள்ள கேள்விகளில் ஒன்றை முயற்சி செய்யலாம்.";
      } else {
        return "I apologize, but I'm having trouble responding right now. Please try again in a moment. You can try one of the questions below.";
      }
    }
  }
}

export const geminiChat = new GeminiChatService();

// Test function to verify API works
export const testGeminiConnection = async () => {
  try {
    const testMessage = "Hello, can you help me?";
    const response = await geminiChat.sendMessage(testMessage);
    console.log("✅ Gemini connection test successful:", response.substring(0, 100));
    return { success: true, message: response.substring(0, 100) + "..." };
  } catch (error: any) {
    console.error("❌ Gemini connection test failed:", error.message);
    return { success: false, error: error.message };
  }
};