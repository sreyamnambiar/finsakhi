import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyB5KOKJRZBqkg8gMPyp0urZ3IjgX4cxB1g";
const genAI = new GoogleGenerativeAI(apiKey);

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are FinSakhi, a friendly and helpful financial literacy assistant designed for rural Indian communities. Your role is to:

1. Teach basic financial concepts in simple, easy-to-understand language
2. Help users understand banking, UPI, ATM usage, and digital payments
3. Explain government schemes and benefits available to them
4. Provide guidance on savings, budgeting, and financial planning
5. Always be patient, supportive, and culturally sensitive
6. Use relatable examples from daily life
7. Encourage safe financial practices
8. NEVER ask for or encourage sharing of personal information like PIN, OTP, Aadhaar, or bank account details

Keep responses concise (2-3 short paragraphs), friendly, and actionable. Use emojis occasionally to make conversations warm and engaging.`;

export class GeminiChatService {
  private model;
  private chatHistory: any[] = [];

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro"
    });
  }

  async startChat(history: Message[] = []) {
    // Initialize with system prompt
    this.chatHistory = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: "I understand. I'm FinSakhi, your friendly financial assistant ready to help!" }]
      }
    ];
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Simple direct call without chat history for now
      const result = await this.model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: `User question: ${message}\n\nPlease respond as FinSakhi, the friendly financial assistant.` }
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      console.log("Gemini response:", text);
      return text;
      
    } catch (error: any) {
      console.error("Detailed Gemini error:", error);
      console.error("Error message:", error?.message);
      console.error("Error response:", error?.response);
      
      // Check for specific error types
      if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('API key')) {
        throw new Error("Invalid API key. Please check your configuration.");
      }
      
      if (error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("API quota exceeded. Please try again later.");
      }

      if (error?.message?.includes('SAFETY')) {
        throw new Error("Message blocked by safety filters. Please rephrase your question.");
      }
      
      throw new Error(`Failed to get response: ${error?.message || 'Unknown error'}`);
    }
  }

  resetChat() {
    this.chatHistory = [];
  }
}

export const geminiChat = new GeminiChatService();
