// @/components/VoiceAssistant.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Loader2, 
  Bot,
  Zap,
  AlertCircle,
  Globe,
  RefreshCw,
  WifiOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FinSakhiMascot } from '@/components/FinSakhiMascot';
import { geminiChat, testGeminiConnection } from '@/lib/gemini';
import { realTimeSpeechService, RealTimeSpeechService } from '@/lib/speech';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Conversation {
  id: string;
  speaker: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isInterim?: boolean;
  error?: boolean;
}

const VoiceAssistant = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'en-US' | 'hi-IN' | 'ta-IN'>('en-US');
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [interimText, setInterimText] = useState('');
  const [autoListen, setAutoListen] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Initialize
  useEffect(() => {
    console.log('🔧 Initializing Voice Assistant');
    
    // Check browser support
    const support = RealTimeSpeechService.checkSupport();
    console.log('Browser support:', support);
    
    if (!support.speechRecognition) {
      setDebugInfo('Speech recognition not supported in this browser');
      toast.error('Voice features require Chrome/Edge with microphone access', {
        duration: 8000,
        action: {
          label: 'Learn More',
          onClick: () => window.open('https://caniuse.com/speech-recognition', '_blank')
        }
      });
    }

    // Test Gemini connection
    const testConnection = async () => {
      setConnectionStatus('checking');
      const result = await testGeminiConnection();
      if (result.success) {
        setConnectionStatus('connected');
        toast.success('AI service connected successfully');
      } else {
        setConnectionStatus('disconnected');
        toast.error(`AI service issue: ${result.error}`, {
          duration: 10000
        });
      }
    };
    
    testConnection();

    // Add welcome message based on language
    const welcomeMessages = {
      'en-US': "Hello! I'm FinSakhi, your financial companion for rural women. I can help you with banking, savings, UPI, and government schemes. How can I assist you today?",
      'hi-IN': "नमस्ते! मैं FinSakhi हूं, ग्रामीण महिलाओं के लिए आपका वित्तीय साथी। मैं आपकी बैंकिंग, बचत, UPI और सरकारी योजनाओं में मदद कर सकती हूं। आज मैं आपकी कैसे सहायता कर सकती हूं?",
      'ta-IN': "வணக்கம்! நான் FinSakhi, கிராமப்புற மகளிருக்கான உங்கள் நிதி துணை. வங்கி, சேமிப்பு, UPI மற்றும் அரசு திட்டங்கள் பற்றி நான் உங்களுக்கு உதவ முடியும். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?"
    };

    setConversation([{
      id: 'welcome',
      speaker: 'assistant',
      text: welcomeMessages[language],
      timestamp: new Date()
    }]);

    // Speak welcome after a delay
    setTimeout(() => {
      speakMessage(welcomeMessages[language]);
    }, 1000);

    return () => {
      console.log('🧹 Cleaning up Voice Assistant');
      realTimeSpeechService.stopListening();
      realTimeSpeechService.stopSpeaking();
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, [language]);

  const handleInterimResult = useCallback((text: string) => {
    console.log('🎤 Interim result:', text);
    setInterimText(text);
  }, []);

  const handleFinalResult = useCallback(async (text: string) => {
    console.log('🎤 Final result received:', text);
    
    if (!text.trim()) {
      console.log('⚠️ Empty text, ignoring');
      toast.warning('No speech detected. Please try again.');
      return;
    }
    
    setInterimText('');
    setDebugInfo(`Processing: "${text}"`);
    
    // Add user message to conversation
    const userMessage: Conversation = {
      id: `user-${Date.now()}`,
      speaker: 'user',
      text: text.trim(),
      timestamp: new Date()
    };
    
    console.log('💬 Adding user message:', userMessage);
    setConversation(prev => [...prev, userMessage]);
    
    // Show processing indicator
    setIsProcessing(true);
    
    try {
      console.log('🤖 Sending to Gemini AI...');
      
      const reply = await geminiChat.sendMessage(text);
      
      console.log('🤖 Gemini response received');
      
      // Add assistant response
      const assistantMessage: Conversation = {
        id: `assistant-${Date.now()}`,
        speaker: 'assistant',
        text: reply,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, assistantMessage]);
      
      // Speak the response
      console.log('🔊 Speaking response...');
      await speakMessage(reply);
      
      // Auto-listen for next input
      if (autoListen) {
        console.log('🔄 Auto-listen enabled, restarting...');
        setTimeout(() => {
          startVoiceInput();
        }, 1500);
      }
    } catch (error: any) {
      console.error('❌ AI processing error:', error);
      
      setDebugInfo(`Error: ${error.message}`);
      
      // Check if it's a rate limit error
      const isRateLimit = error.message?.includes('Rate limit') || error.message?.includes('quota');
      
      let errorMessage = language === 'hi-IN' ? 
        "क्षमा करें, मुझे प्रतिक्रिया देने में समस्या हो रही है। कृपया फिर से प्रयास करें।" :
        language === 'ta-IN' ? 
        "மன்னிக்கவும், பதில் அளிப்பதில் சிக்கல் உள்ளது. தயவு செய்து மீண்டும் முயற்சிக்கவும்." :
        "Sorry, I'm having trouble responding. Please try again.";
      
      if (isRateLimit) {
        errorMessage = language === 'hi-IN' ? 
          "क्षमा करें, बहुत सारे अनुरोध हो गए हैं। कृपया कुछ सेकंड प्रतीक्षा करें।" :
          language === 'ta-IN' ? 
          "மன்னிக்கவும், பல கோரிக்கைகள் வந்துள்ளன. சிறிது நேரம் காத்திருக்கவும்." :
          "Sorry, too many requests. Please wait a moment and try again.";
      }
      
      setConversation(prev => [...prev, {
        id: `error-${Date.now()}`,
        speaker: 'assistant',
        text: errorMessage,
        timestamp: new Date(),
        error: true
      }]);
      
      toast.error(error.message, { duration: 5000 });
    } finally {
      setIsProcessing(false);
      setDebugInfo('Ready for next input');
    }
  }, [autoListen, language]);

  const handleSpeechError = useCallback((error: string) => {
    console.error('🎤 Speech error:', error);
    setDebugInfo(`Speech error: ${error}`);
    
    setIsListening(false);
    
    const errorMessages = {
      'not-allowed': 'Microphone permission denied. Please allow access in browser settings.',
      'permission-denied': 'Microphone permission denied. Please allow access in browser settings.',
      'not-supported': 'Voice features require Chrome or Edge browser.',
      'no-speech': 'No speech detected. Please speak louder and clearer.',
      'network': 'Network error. Please check your internet connection.',
      'start-failed': 'Failed to start voice recognition. Please try again.',
      'default': 'Voice recognition error. Please try again.'
    };
    
    toast.error(errorMessages[error as keyof typeof errorMessages] || errorMessages.default);
    
    // Don't auto-restart on certain errors to prevent loops
    const noRestartErrors = ['not-allowed', 'permission-denied', 'start-failed', 'network'];
    if (autoListen && !noRestartErrors.includes(error)) {
      // Only restart if not already listening or processing
      setTimeout(() => {
        if (!isListening && !isProcessing && !isSpeaking) {
          startVoiceInput();
        }
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoListen, isListening, isProcessing, isSpeaking]);

  const startVoiceInput = useCallback(() => {
    console.log('🎤 Starting voice input...');
    
    if (isListening) {
      console.log('🎤 Already listening, stopping...');
      realTimeSpeechService.stopListening();
      setIsListening(false);
      setInterimText('');
      return;
    }

    // Check if already processing
    if (isProcessing || isSpeaking) {
      console.log('⚠️ Cannot start listening - busy');
      toast.warning('Please wait for current action to complete');
      return;
    }

    setIsListening(true);
    setInterimText('');
    setDebugInfo('Listening...');

    // Clear any previous timeout
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }

    // Set timeout for no speech
    speechTimeoutRef.current = setTimeout(() => {
      if (isListening) {
        console.log('⏰ No speech timeout');
        handleSpeechError('no-speech');
        setIsListening(false);
      }
    }, 10000);

    // Start listening
    realTimeSpeechService.startListening(
      (text) => {
        console.log('✅ Final callback received:', text);
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }
        setIsListening(false);
        handleFinalResult(text);
      },
      (error) => {
        console.log('❌ Error callback received:', error);
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }
        setIsListening(false);
        handleSpeechError(error);
      },
      language,
      (interim) => {
        console.log('🎤 Interim callback:', interim);
        handleInterimResult(interim);
      }
    );
  }, [isListening, isProcessing, isSpeaking, language, handleFinalResult, handleSpeechError, handleInterimResult]);

  const speakMessage = async (text: string) => {
    if (!text) {
      console.log('⚠️ No text to speak');
      return;
    }
    
    console.log('🔊 Starting speech synthesis...');
    
    try {
      setIsSpeaking(true);
      const voiceLang = language === 'en-US' ? 'english' : 
                       language === 'hi-IN' ? 'hindi' : 'tamil';
      console.log(`🔊 Language: ${voiceLang}`);
      
      await realTimeSpeechService.speak(text, voiceLang);
      console.log('✅ Speech synthesis completed');
    } catch (error) {
      console.error('❌ Speech synthesis error:', error);
      toast.error('Failed to speak response');
    } finally {
      setIsSpeaking(false);
      console.log('🔊 Speech synthesis ended');
    }
  };

  const stopSpeaking = () => {
    console.log('⏹️ Stopping speech...');
    realTimeSpeechService.stopSpeaking();
    setIsSpeaking(false);
  };

  const cycleLanguage = () => {
    const langs: Array<'en-US' | 'hi-IN' | 'ta-IN'> = ['en-US', 'hi-IN', 'ta-IN'];
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    const nextLang = langs[nextIndex];
    
    setLanguage(nextLang);
    
    const langNames = { 
      'en-US': 'English', 
      'hi-IN': 'हिंदी', 
      'ta-IN': 'தமிழ்' 
    };
    
    toast.success(`Language changed to ${langNames[nextLang]}`);
    
    // Update conversation with language change message
    const changeMessage = language === 'hi-IN' ? 'भाषा बदल गई है' :
                         language === 'ta-IN' ? 'மொழி மாற்றப்பட்டது' :
                         'Language changed';
    
    speakMessage(changeMessage);
  };

  const clearConversation = () => {
    console.log('🗑️ Clearing conversation');
    setConversation([]);
    setInterimText('');
    setDebugInfo('Conversation cleared');
    
    // Add new welcome message
    const welcomeMessages = {
      'en-US': "Hello! I'm FinSakhi, ready to help you with banking, savings, or UPI.",
      'hi-IN': "नमस्ते! मैं FinSakhi हूं, आपकी बैंकिंग, बचत या UPI में मदद के लिए तैयार हूं।",
      'ta-IN': "வணக்கம்! நான் FinSakhi, வங்கி, சேமிப்பு அல்லது UPI பற்றி உங்களுக்கு உதவ தயாராக உள்ளேன்."
    };
    
    setConversation([{
      id: 'welcome',
      speaker: 'assistant',
      text: welcomeMessages[language],
      timestamp: new Date()
    }]);
  };

  const retryConnection = async () => {
    setConnectionStatus('checking');
    const result = await testGeminiConnection();
    if (result.success) {
      setConnectionStatus('connected');
      toast.success('Reconnected to AI service');
    } else {
      setConnectionStatus('disconnected');
      toast.error('Still unable to connect: ' + result.error);
    }
  };

  // Quick questions in different languages
  const quickQuestions = [
    // English
    { text: "Bank account documents", query: "What documents do I need to open a bank account?", lang: 'en-US' },
    { text: "Create UPI ID", query: "How to create UPI ID?", lang: 'en-US' },
    { text: "Savings schemes", query: "Best savings schemes for women?", lang: 'en-US' },
    { text: "Government schemes", query: "Government schemes for rural women?", lang: 'en-US' },
    
    // Hindi
    { text: "बैंक खाता दस्तावेज़", query: "बैंक खाता खोलने के लिए कौन से दस्तावेज़ चाहिए?", lang: 'hi-IN' },
    { text: "UPI आईडी बनाएं", query: "UPI आईडी कैसे बनाएं?", lang: 'hi-IN' },
    { text: "बचत योजनाएं", query: "महिलाओं के लिए सबसे अच्छी बचत योजनाएं कौन सी हैं?", lang: 'hi-IN' },
    { text: "सरकारी योजनाएं", query: "ग्रामीण महिलाओं के लिए सरकारी योजनाएं कौन सी हैं?", lang: 'hi-IN' },
    
    // Tamil
    { text: "வங்கிக் கணக்கு ஆவணங்கள்", query: "வங்கிக் கணக்கு திறக்க என்ன ஆவணங்கள் தேவை?", lang: 'ta-IN' },
    { text: "UPI ஐடி உருவாக்க", query: "UPI ஐடி எப்படி உருவாக்குவது?", lang: 'ta-IN' },
    { text: "சேமிப்புத் திட்டங்கள்", query: "பெண்களுக்கான சிறந்த சேமிப்புத் திட்டங்கள் எவை?", lang: 'ta-IN' },
    { text: "அரசுத் திட்டங்கள்", query: "கிராமப்புற பெண்களுக்கான அரசு திட்டங்கள் என்ன?", lang: 'ta-IN' },
  ];

  // Filter questions by current language
  const filteredQuestions = quickQuestions.filter(q => q.lang === language).slice(0, 4);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Manual test function
  const testVoiceInput = () => {
    const testText = language === 'hi-IN' ? "बैंक खाता कैसे खोलें?" :
                    language === 'ta-IN' ? "வங்கிக் கணக்கை எப்படி திறக்கலாம்?" :
                    "How to open a bank account?";
    
    console.log('🧪 Testing with text:', testText);
    handleFinalResult(testText);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 px-5 pt-6 pb-4 bg-background/80 backdrop-blur-lg border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <FinSakhiMascot size="sm" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {language === 'hi-IN' ? 'वॉयस असिस्टेंट' : 
                 language === 'ta-IN' ? 'குரல் உதவியாளர்' : 
                 'Voice Assistant'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === 'hi-IN' ? 'FinSakhi से बात करें' : 
                 language === 'ta-IN' ? 'FinSakhi உடன் பேசுங்கள்' : 
                 'Speak naturally with FinSakhi'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testVoiceInput}
              className="gap-2"
            >
              {language === 'hi-IN' ? 'टेस्ट' : 
               language === 'ta-IN' ? 'சோதனை' : 
               'Test'}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Connection Status */}
      {connectionStatus !== 'connected' && (
        <Alert className={`mx-4 mt-4 ${connectionStatus === 'disconnected' ? 'bg-destructive/20 border-destructive/30' : 'bg-blue-500/20 border-blue-500/30'}`}>
          {connectionStatus === 'checking' ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Checking AI service connection...
              </AlertDescription>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  AI service disconnected. Some features may not work.
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={retryConnection}
                className="h-8 gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
            </div>
          )}
        </Alert>
      )}

      {/* Debug Panel */}
      {debugInfo && (
        <Alert className="mx-4 mt-4 bg-muted">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">
            {debugInfo}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        {/* Conversation Area */}
        <Card className="flex-1 mb-6 overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[50vh] space-y-4">
              {conversation.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.speaker === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : msg.error
                      ? 'bg-destructive/20 text-destructive-foreground rounded-tl-none'
                      : 'bg-muted rounded-tl-none'
                  } ${msg.isInterim ? 'opacity-70 italic' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {msg.speaker === 'assistant' ? (
                        <Bot size={12} className={msg.error ? 'text-destructive' : 'opacity-70'} />
                      ) : (
                        <Mic size={12} className="opacity-70" />
                      )}
                      <span className="text-xs opacity-70">
                        {msg.speaker === 'assistant' ? 'FinSakhi' : 
                         language === 'hi-IN' ? 'आप' : 
                         language === 'ta-IN' ? 'நீங்கள்' : 
                         'You'}
                        {msg.isInterim && ' (typing...)'}
                        {msg.error && ' (error)'}
                      </span>
                      <span className="text-xs opacity-50 ml-auto">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className={msg.isInterim ? 'italic' : ''}>
                      {msg.text}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {/* Interim text bubble */}
              {interimText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] rounded-2xl p-4 bg-primary/20 border border-primary/30 rounded-tr-none">
                    <div className="flex items-center gap-2 mb-1">
                      <Mic size={12} className="animate-pulse" />
                      <span className="text-xs">
                        {language === 'hi-IN' ? 'सुन रहा हूं...' : 
                         language === 'ta-IN' ? 'கேட்கிறது...' : 
                         'Listening...'}
                      </span>
                      <div className="flex gap-1 ml-2">
                        <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
                        <div className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                    <p className="italic">{interimText}</p>
                  </div>
                </motion.div>
              )}
              
              <div ref={conversationEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        {filteredQuestions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {language === 'hi-IN' ? 'प्रयास करें:' : 
               language === 'ta-IN' ? 'முயற்சிக்க:' : 
               'Try asking:'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {filteredQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleFinalResult(q.query)}
                  className="gap-2 truncate"
                  disabled={isProcessing || isSpeaking || isListening}
                >
                  <span className="truncate">{q.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Control Bar */}
        <div className="flex flex-col items-center gap-6">
          {/* Status Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs mt-1">
                {language === 'hi-IN' ? 'माइक' : 
                 language === 'ta-IN' ? 'மைக்' : 
                 'Mic'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs mt-1">
                {language === 'hi-IN' ? 'स्पीकर' : 
                 language === 'ta-IN' ? 'ஸ்பீக்கர்' : 
                 'Speaker'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-blue-500 animate-spin' : 'bg-gray-400'}`} />
              <span className="text-xs mt-1">AI</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={cycleLanguage}
              className="gap-2 hover:bg-accent"
            >
              <Globe size={14} />
              {language === 'en-US' ? 'English' : language === 'hi-IN' ? 'हिंदी' : 'தமிழ்'}
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs">
                {language === 'hi-IN' ? 'ऑटो लिसन:' : 
                 language === 'ta-IN' ? 'தானாக கேள்:' : 
                 'Auto-listen:'}
              </span>
              <div 
                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${autoListen ? 'bg-primary' : 'bg-muted'}`}
                onClick={() => {
                  setAutoListen(!autoListen);
                  toast.success(
                    autoListen ? 
                    (language === 'hi-IN' ? 'ऑटो लिसन अक्षम' : 
                     language === 'ta-IN' ? 'தானாக கேட்க முடக்கப்பட்டது' : 
                     'Auto-listen disabled') :
                    (language === 'hi-IN' ? 'ऑटो लिसन सक्षम' : 
                     language === 'ta-IN' ? 'தானாக கேட்க இயக்கப்பட்டது' : 
                     'Auto-listen enabled')
                  );
                }}
              >
                <div className={`bg-white w-3 h-3 rounded-full transition-transform ${autoListen ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>

          {/* Main Control Button */}
          <div className="relative">
            <motion.div
              animate={{
                scale: isListening ? [1, 1.2, 1] : 1,
                boxShadow: isListening 
                  ? '0 0 0 0 rgba(239, 68, 68, 0.7)' 
                  : 'none'
              }}
              transition={{
                repeat: isListening ? Infinity : 0,
                duration: 1.5
              }}
              className="absolute inset-0 rounded-full"
            />
            
            <Button
              size="lg"
              onClick={startVoiceInput}
              disabled={isProcessing || isSpeaking || connectionStatus === 'disconnected'}
              className={`gap-3 rounded-full px-10 py-8 text-lg relative z-10 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg' 
                  : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
              } ${connectionStatus === 'disconnected' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? (
                <>
                  <MicOff size={24} />
                  {language === 'hi-IN' ? 'रुकें' : 
                   language === 'ta-IN' ? 'நிறுத்து' : 
                   'Stop Listening'}
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  {language === 'hi-IN' ? 'प्रोसेसिंग...' : 
                   language === 'ta-IN' ? 'செயலாக்கம்...' : 
                   'Processing...'}
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 size={24} className="animate-pulse" />
                  {language === 'hi-IN' ? 'बोल रहा हूं...' : 
                   language === 'ta-IN' ? 'பேசுகிறது...' : 
                   'Speaking...'}
                </>
              ) : (
                <>
                  <Mic size={24} />
                  {language === 'hi-IN' ? 'बोलना शुरू करें' : 
                   language === 'ta-IN' ? 'பேச தொடங்குங்கள்' : 
                   'Start Speaking'}
                </>
              )}
            </Button>
          </div>

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <Button
              variant="destructive"
              size="sm"
              onClick={stopSpeaking}
              className="gap-2 animate-in slide-in-from-bottom"
            >
              <VolumeX size={16} />
              {language === 'hi-IN' ? 'बोलना बंद करें' : 
               language === 'ta-IN' ? 'பேசுவதை நிறுத்து' : 
               'Stop Speaking'}
            </Button>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFinalResult(
                language === 'hi-IN' ? "बैंक खाता खोलने के लिए कौन से दस्तावेज़ चाहिए?" :
                language === 'ta-IN' ? "வங்கிக் கணக்கு திறக்க என்ன ஆவணங்கள் தேவை?" :
                "What documents do I need to open a bank account?"
              )}
              className="gap-2"
              disabled={isProcessing || isSpeaking || isListening}
            >
              {language === 'hi-IN' ? 'दस्तावेज़' : 
               language === 'ta-IN' ? 'ஆவணங்கள்' : 
               'Documents'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFinalResult(
                language === 'hi-IN' ? "UPI आईडी कैसे बनाएं?" :
                language === 'ta-IN' ? "UPI ஐடி எப்படி உருவாக்குவது?" :
                "How to create UPI ID?"
              )}
              className="gap-2"
              disabled={isProcessing || isSpeaking || isListening}
            >
              {language === 'hi-IN' ? 'UPI गाइड' : 
               language === 'ta-IN' ? 'UPI வழிகாட்டி' : 
               'UPI Guide'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFinalResult(
                language === 'hi-IN' ? "महिलाओं के लिए सबसे अच्छी बचत योजनाएं कौन सी हैं?" :
                language === 'ta-IN' ? "பெண்களுக்கான சிறந்த சேமிப்புத் திட்டங்கள் எவை?" :
                "Best savings schemes for women?"
              )}
              className="gap-2"
              disabled={isProcessing || isSpeaking || isListening}
            >
              {language === 'hi-IN' ? 'बचत' : 
               language === 'ta-IN' ? 'சேமிப்பு' : 
               'Savings'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              className="gap-2"
              disabled={isProcessing || isSpeaking || isListening}
            >
              {language === 'hi-IN' ? 'साफ करें' : 
               language === 'ta-IN' ? 'துடைக்க' : 
               'Clear'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="px-4 pb-8 max-w-4xl mx-auto w-full">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              {language === 'hi-IN' ? 'इस वॉयस असिस्टेंट का उपयोग कैसे करें:' : 
               language === 'ta-IN' ? 'இந்த குரல் உதவியாளரை எப்படி பயன்படுத்துவது:' : 
               'How to use this voice assistant:'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  {language === 'hi-IN' ? '🎤 बोलने के टिप्स:' : 
                   language === 'ta-IN' ? '🎤 பேசும் உதவிக்குறிப்புகள்:' : 
                   '🎤 Speaking Tips:'}
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {language === 'hi-IN' ? 'सामान्य गति से स्पष्ट बोलें' : 
                     language === 'ta-IN' ? 'சாதாரண வேகத்தில் தெளிவாக பேசுங்கள்' : 
                     'Speak clearly at a normal pace'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {language === 'hi-IN' ? 'माइक्रोफोन को करीब रखें (10-20 सेमी)' : 
                     language === 'ta-IN' ? 'மைக்கை நெருக்கமாக வைத்திருங்கள் (10-20 செமீ)' : 
                     'Keep microphone close (10-20 cm)'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {language === 'hi-IN' ? 'वाक्यों के बीच थोड़ा रुकें' : 
                     language === 'ta-IN' ? 'வாக்கியங்களுக்கு இடையே சிறிது நிறுத்துங்கள்' : 
                     'Pause briefly between sentences'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {language === 'hi-IN' ? 'सर्वोत्तम परिणामों के लिए Chrome/Edge का उपयोग करें' : 
                     language === 'ta-IN' ? 'சிறந்த முடிவுகளுக்கு Chrome/Edge பயன்படுத்தவும்' : 
                     'Use Chrome/Edge for best results'}
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  {language === 'hi-IN' ? '🔧 समस्या निवारण:' : 
                   language === 'ta-IN' ? '🔧 பழுதுநீக்கம்:' : 
                   '🔧 Troubleshooting:'}
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    {language === 'hi-IN' ? 'कोई प्रतिक्रिया नहीं? कंसोल में त्रुटियाँ देखें' : 
                     language === 'ta-IN' ? 'பதில் இல்லையா? பிழைகளுக்கான கன்சோலை சரிபார்க்கவும்' : 
                     'No response? Check console for errors'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    {language === 'hi-IN' ? 'माइक काम नहीं कर रहा? अनुमतियाँ दें' : 
                     language === 'ta-IN' ? 'மைக் வேலை செய்யவில்லையா? அனுமதிகளை அனுமதிக்கவும்' : 
                     'Mic not working? Allow permissions'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    {language === 'hi-IN' ? 'धीमा? इंटरनेट कनेक्शन जांचें' : 
                     language === 'ta-IN' ? 'மெதுவாக? இணைய இணைப்பைச் சரிபார்க்கவும்' : 
                     'Slow? Check internet connection'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    {language === 'hi-IN' ? 'अभी भी समस्याएं? टेस्ट बटन आज़माएं' : 
                     language === 'ta-IN' ? 'இன்னும் சிக்கல்கள்? சோதனை பொத்தானை முயற்சிக்கவும்' : 
                     'Still issues? Try the Test button'}
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 <strong>
                  {language === 'hi-IN' ? 'प्रो टिप:' : 
                   language === 'ta-IN' ? 'நிபுணர் உதவிக்குறிப்பு:' : 
                   'Pro Tip:'}
                </strong> 
                {language === 'hi-IN' ? ' निरंतर वार्तालाप के लिए "ऑटो लिसन" सक्षम करें। सहायक प्रत्येक प्रतिक्रिया के बाद स्वचालित रूप से सुनना शुरू कर देगा।' : 
                 language === 'ta-IN' ? ' தொடர்ச்சியான உரையாடலுக்கு "தானாக கேள்" இயக்கவும். உதவியாளர் ஒவ்வொரு பதிலுக்கும் பிறகு தானாக கேட்கத் தொடங்கும்.' : 
                 ' Enable "Auto-listen" for continuous conversation. The assistant will automatically start listening after each response.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceAssistant;