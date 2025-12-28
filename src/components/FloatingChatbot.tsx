import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Minimize2 } from 'lucide-react';
import { geminiChat, Message } from '@/lib/gemini';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { FinSakhiMascot } from './FinSakhiMascot';

export const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: 'Hello! I\'m FinSakhi 👋 Ask me anything about banking, savings, UPI, or government schemes!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiChat.sendMessage(input.trim());
      
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Provide contextual fallback responses based on question
      const question = input.trim().toLowerCase();
      let fallbackContent = '';
      
      if (question.includes('atm')) {
        fallbackContent = 'To use an ATM: 1) Insert your card 2) Enter your 4-digit PIN 3) Select "Withdrawal" 4) Choose amount 5) Take cash and card. Always cover the keypad when entering PIN and check for any suspicious devices on the ATM.';
      } else if (question.includes('upi')) {
        fallbackContent = 'UPI (Unified Payments Interface) lets you send money instantly using just a phone number or UPI ID. Popular apps include Google Pay, PhonePe, and Paytm. To use: 1) Download app 2) Link bank account 3) Create UPI PIN 4) Start sending money. It\'s free and instant!';
      } else if (question.includes('save') || question.includes('saving')) {
        fallbackContent = 'Smart saving tips: 1) Save at least 10% of your income 2) Open a savings account in a bank 3) Use Recurring Deposit (RD) for monthly savings 4) Try Public Provident Fund (PPF) for long-term 5) Keep emergency fund for 3-6 months expenses. Start small, stay consistent!';
      } else if (question.includes('scheme') || question.includes('government')) {
        fallbackContent = 'Government schemes for women: 1) Pradhan Mantri Jan Dhan Yojana (free bank account) 2) Sukanya Samriddhi Yojana (for daughters) 3) Mudra Loan (business loans up to ₹10 lakh) 4) Stand Up India (loans for women entrepreneurs). Visit your nearest bank to apply!';
      } else if (question.includes('loan') || question.includes('borrow')) {
        fallbackContent = 'Getting loans: 1) Check your eligibility 2) Compare interest rates 3) Read terms carefully 4) Keep documents ready (ID, income proof) 5) Consider government schemes like Mudra Loan. Never borrow from unofficial sources. Banks and government programs are safest.';
      } else if (question.includes('account') || question.includes('bank')) {
        fallbackContent = 'Opening a bank account: 1) Choose a nearby bank 2) Bring Aadhaar card and one photo 3) Fill simple form 4) Get passbook and debit card. Benefits: Your money is safe, you earn interest, can receive government benefits directly, and can do UPI payments!';
      } else {
        fallbackContent = 'FinSakhi is your financial friend! I can help you with: Banking basics, ATM usage, UPI payments, Saving tips, Government schemes, Loans, and Livelihood opportunities. Try asking specific questions like "How to open bank account?" or "What is UPI?"';
      }
      
      const fallbackMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
      console.log('Using contextual fallback response');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'How to use ATM?',
    'What is UPI?',
    'Save money tips',
    'Government schemes'
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-primary/90 transition-colors"
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background shadow-2xl z-50 flex flex-col border-l"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FinSakhiMascot size="sm" />
                <div>
                  <h3 className="font-bold text-sm">FinSakhi Assistant</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                >
                  <Minimize2 size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Safety Banner */}
            {!isMinimized && (
              <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  🔒 Never share OTP, PIN, or personal details
                </p>
              </div>
            )}

            {!isMinimized ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-2xl px-3 py-2 flex items-center gap-2">
                        <Loader2 className="animate-spin" size={14} />
                        <span className="text-xs text-muted-foreground">Typing...</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Quick Questions */}
                  {messages.length === 1 && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <p className="text-xs text-muted-foreground font-medium">Quick questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInput(q)}
                            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 py-3 border-t bg-background">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="flex-1 px-3 py-2 text-sm rounded-full bg-muted border-none focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Chat minimized</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
