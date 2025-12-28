// @/lib/gemini.ts

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

let rateLimitedUntil: number | null = null; // ⛔ cooldown lock

const SYSTEM_PROMPT = `You are FinSakhi — a friendly, knowledgeable financial companion for rural women in India.

IMPORTANT INSTRUCTIONS:
1. Respond in the SAME LANGUAGE as the user's question (English/Hindi/Tamil)
2. Keep answers clear, simple, and practical
3. Focus on empowering women with financial knowledge
4. Never ask for sensitive information (PIN, OTP, Aadhaar, passwords)
5. Provide step-by-step guidance when explaining procedures
6. Use examples that rural women can relate to
7. Be encouraging and supportive

Always end with a helpful suggestion or next step.`;

export class GeminiChatService {
  private apiKey: string;

  constructor() {
    this.apiKey = apiKey;
    if (!this.apiKey) {
      console.error("⚠️ Gemini API key missing");
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Gemini API key not configured");
    }

    // ⛔ HARD STOP DURING RATE LIMIT
    if (rateLimitedUntil && Date.now() < rateLimitedUntil) {
      throw new Error("AI is cooling down. Please wait a few seconds.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    const isHindi = /[\u0900-\u097F]/.test(message);
    const isTamil = /[\u0B80-\u0BFF]/.test(message);

    const languageHint = isHindi
      ? "Respond in Hindi."
      : isTamil
      ? "Respond in Tamil."
      : "Respond in English.";

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}

${languageHint}

User question: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 800
      }
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        // 🚨 RATE LIMIT HANDLING
        if (response.status === 429) {
          const retryMatch = data.error?.message?.match(/(\d+(\.\d+)?)s/);
          const retrySeconds = retryMatch ? Math.ceil(Number(retryMatch[1])) : 30;

          rateLimitedUntil = Date.now() + retrySeconds * 1000;
          throw new Error(`Rate limit exceeded. Wait ${retrySeconds}s.`);
        }

        throw new Error(data.error?.message || "Gemini error");
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Empty AI response");
      }

      return text.trim();

    } catch (error: any) {
      console.error("❌ Gemini error:", error.message);
      throw error; // ⬅️ IMPORTANT: DO NOT SWALLOW ERROR
    }
  }
}

export const geminiChat = new GeminiChatService();

// 🧪 Test connection and check quota
export async function testGeminiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await geminiChat.sendMessage("Test");
    return { success: true, message: "Connected to Gemini AI" };
  } catch (error: any) {
    return { success: false, message: error.message || "Connection failed" };
  }
}
