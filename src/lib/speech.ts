// @/lib/speech.ts
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class RealTimeSpeechService {
  private recognition: any;
  private speechSynthesis: SpeechSynthesis;
  private _isRecognitionSupported: boolean;
  private isCurrentlyListening = false;
  private isCurrentlySpeaking = false;

  private onResultCallback: ((text: string) => void) | null = null;
  private onInterimCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this._isRecognitionSupported = !!SR;

    if (this._isRecognitionSupported) {
      this.recognition = new SR();
      this.setupRecognition();
    }

    this.speechSynthesis = window.speechSynthesis;
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      this.isCurrentlyListening = true;
    };

    this.recognition.onend = () => {
      console.log('🎤 Speech recognition ended');
      this.isCurrentlyListening = false;
    };

    this.recognition.onerror = (event: any) => {
      console.error('🎤 Speech recognition error:', event.error);
      this.isCurrentlyListening = false;
      this.onErrorCallback?.(event.error);
    };

    this.recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (!res[0]) continue;

        if (res.isFinal) {
          finalText += res[0].transcript;
        } else {
          interimText += res[0].transcript;
        }
      }

      if (interimText && this.onInterimCallback) {
        console.log('🎤 Interim:', interimText);
        this.onInterimCallback(interimText);
      }

      if (finalText && this.onResultCallback) {
        console.log('🎤 Final:', finalText);
        this.onResultCallback(finalText.trim());
      }
    };
  }

  startListening(
    onResult: (text: string) => void,
    onError?: (error: string) => void,
    language = 'en-US',
    onInterim?: (text: string) => void
  ) {
    console.log('🎤 Starting listening in language:', language);
    
    if (!this._isRecognitionSupported) {
      console.error('❌ Speech recognition not supported');
      onError?.('not-supported');
      return;
    }

    // Don't start if already listening or speaking
    if (this.isCurrentlyListening) {
      console.log('⚠️ Already listening, stopping first');
      this.stopListening();
      // Wait a bit before starting again
      setTimeout(() => this.startListening(onResult, onError, language, onInterim), 300);
      return;
    }
    
    if (this.isCurrentlySpeaking) {
      console.log('⚠️ Currently speaking, cannot start listening');
      return;
    }

    this.onResultCallback = onResult;
    this.onInterimCallback = onInterim || null;
    this.onErrorCallback = onError || null;

    try {
      this.recognition.lang = language;
      this.recognition.start();
    } catch (error) {
      console.error('❌ Failed to start recognition:', error);
      this.isCurrentlyListening = false;
      onError?.('start-failed');
    }
  }

  stopListening() {
    if (!this.recognition || !this.isCurrentlyListening) return;
    
    console.log('🎤 Stopping listening');
    
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }

  async speak(text: string, language: 'english' | 'hindi' | 'tamil' = 'english'): Promise<void> {
    if (!this.speechSynthesis || !text.trim()) {
      console.log('⚠️ No speech synthesis or text');
      return Promise.resolve();
    }

    console.log('🔊 Speaking:', text.substring(0, 50) + '...');
    
    // Stop listening before speaking
    this.stopListening();
    
    // Cancel any ongoing speech
    this.speechSynthesis.cancel();
    
    return new Promise((resolve) => {
      this.isCurrentlySpeaking = true;
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = 
        language === 'hindi' ? 'hi-IN' :
        language === 'tamil' ? 'ta-IN' :
        'en-US';
      
      // Configure voice
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Try to find appropriate voice
      const voices = this.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langCode = language === 'hindi' ? 'hi' : 
                        language === 'tamil' ? 'ta' : 'en';
        const voice = voices.find(v => v.lang.startsWith(langCode));
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      utterance.onend = () => {
        console.log('✅ Speech finished');
        this.isCurrentlySpeaking = false;
        resolve();
      };
      
      utterance.onerror = (error) => {
        console.error('🔊 Speech error:', error);
        this.isCurrentlySpeaking = false;
        resolve();
      };
      
      // Small delay to ensure everything is ready
      setTimeout(() => {
        this.speechSynthesis.speak(utterance);
      }, 100);
    });
  }

  stopSpeaking() {
    console.log('🔊 Stopping speech');
    this.speechSynthesis?.cancel();
    this.isCurrentlySpeaking = false;
  }

  get isRecognitionSupported() {
    return this._isRecognitionSupported;
  }

  get isListening() {
    return this.isCurrentlyListening;
  }

  get isSpeaking() {
    return this.isCurrentlySpeaking;
  }

  // Static method to check browser support
  static checkSupport() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isChrome = /chrome/i.test(navigator.userAgent);
    const isEdge = /edg/i.test(navigator.userAgent);
    
    return {
      speechRecognition: !!SR,
      speechSynthesis: 'speechSynthesis' in window,
      browser: isChrome ? 'Chrome' : isEdge ? 'Edge' : 'Other',
      userAgent: navigator.userAgent
    };
  }
}

export const realTimeSpeechService = new RealTimeSpeechService();
export { RealTimeSpeechService };