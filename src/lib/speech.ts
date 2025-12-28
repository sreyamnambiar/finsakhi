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
    this.recognition.maxAlternatives = 3;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isCurrentlyListening = true;
    };

    this.recognition.onend = () => {
      this.isCurrentlyListening = false;
    };

    this.recognition.onerror = (event: any) => {
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
        this.onInterimCallback(interimText);
      }

      if (finalText && this.onResultCallback) {
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
    if (!this._isRecognitionSupported) {
      onError?.('not-supported');
      return;
    }

    // ✅ HARD GUARD (CRITICAL FIX)
    if (this.isCurrentlyListening) return;

    this.onResultCallback = onResult;
    this.onInterimCallback = onInterim || null;
    this.onErrorCallback = onError || null;

    try {
      this.recognition.lang = language;
      this.recognition.start();
    } catch {
      this.isCurrentlyListening = false;
      onError?.('start-failed');
    }
  }

  stopListening() {
    if (!this.recognition || !this.isCurrentlyListening) return;

    try {
      this.recognition.stop();
    } catch {}
  }

  async speak(text: string, language: 'english' | 'hindi' | 'tamil' = 'english') {
    if (!this.speechSynthesis || !text) return;

    // ✅ stop mic before TTS (ElevenLabs safe)
    this.stopListening();

    this.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      language === 'hindi' ? 'hi-IN' :
      language === 'tamil' ? 'ta-IN' :
      'en-US';

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    return new Promise<void>((resolve) => {
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      this.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    this.speechSynthesis?.cancel();
  }

  get isRecognitionSupported() {
    return this._isRecognitionSupported;
  }

  static checkSupport() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    return {
      speechRecognition: !!SR,
      speechSynthesis: 'speechSynthesis' in window,
      userAgent: navigator.userAgent
    };
  }
}

export const realTimeSpeechService = new RealTimeSpeechService();
export { RealTimeSpeechService };
