/// <reference lib="dom" />
/// <reference lib="es2015" />

// This service abstracts the browser's SpeechSynthesis API to provide a cleaner and more robust interface.
// It handles voice loading, selection, and speaking, and is designed to be easily replaced with a
// different TTS provider (e.g., Google Cloud TTS, ElevenLabs) in the future.

interface SpeakOptions {
  onStart: () => void;
  onEnd: () => void;
  onError: (error: any) => void;
}

class TTSService {
  private synth: SpeechSynthesis | null;
  private voices: SpeechSynthesisVoice[] = [];
  private keepAliveInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    } else {
      this.synth = null;
      console.warn('Speech Synthesis not supported in this browser.');
    }
  }

  initialize(onVoicesChanged: () => void) {
    if (!this.synth) return;

    // The 'voiceschanged' event is the standard way to get the list of voices.
    this.synth.onvoiceschanged = () => {
      this.loadVoices();
      onVoicesChanged();
    };
    
    // Initial load, in case the event has already fired.
    this.loadVoices();
    if (this.voices.length > 0) {
        onVoicesChanged();
    }

    this.startKeepAlive();
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  // This workaround helps prevent the speech engine from going idle in some browsers.
  private startKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    this.keepAliveInterval = window.setInterval(() => {
      if (this.synth?.paused) {
        this.synth.resume();
      }
    }, 5000);
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.voices) return [];
    
    // Mobile-friendly voice preferences that work across platforms
    const preferredVoices = [
        'Google US English', // Chrome/Android - widely available
        'Google UK English Female',
        'Google UK English Male',
        'Microsoft Zira - English (United States)', // Windows
        'Microsoft David - English (United States)', // Windows
        'Samantha', // macOS/iOS
        'Alex',     // macOS/iOS
    ];

    const englishVoices = this.voices
        .filter(voice => voice.lang.startsWith('en'))
        .sort((a, b) => {
            const aIsPreferred = preferredVoices.indexOf(a.name);
            const bIsPreferred = preferredVoices.indexOf(b.name);

            // Sort by the curated list first
            if (aIsPreferred > -1 && bIsPreferred > -1) {
                return aIsPreferred - bIsPreferred;
            }
            if (aIsPreferred > -1) return -1;
            if (bIsPreferred > -1) return 1;
            
            // Prefer local voices over remote ones for reliability
            if (a.localService && !b.localService) return -1;
            if (!a.localService && b.localService) return 1;

            return a.name.localeCompare(b.name);
        });

    return englishVoices;
  }
  
  getDefaultVoiceURI(): string | null {
    const voices = this.getAvailableVoices();
    return voices.length > 0 ? voices[0].voiceURI : null;
  }

  speak(text: string, voiceURI: string | null, options: SpeakOptions) {
    if (!this.synth || !text.trim()) {
      options.onEnd();
      return;
    }

    // Robustly stop any previous speech before starting a new one.
    if (this.synth.speaking) {
      this.synth.cancel();
      
      // A brief timeout allows the cancel command to process fully.
      setTimeout(() => this.createAndSpeak(text, voiceURI, options), 100);
    } else {
      this.createAndSpeak(text, voiceURI, options);
    }
  }
  
  private createAndSpeak(text: string, voiceURI: string | null, options: SpeakOptions) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = this.voices.find(v => v.voiceURI === voiceURI) || this.voices.find(v => v.default);
    if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
    }
    
    utterance.onstart = options.onStart;
    
    utterance.onend = () => {
        // Failsafe: Ensure the speaking state is false even if the browser doesn't fire events correctly.
        if (this.synth?.speaking) {
            this.synth.cancel();
        }
        options.onEnd();
    };
    
    utterance.onerror = (event) => {
      // 'interrupted' and 'canceled' are expected when we stop speech manually.
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Speech synthesis error:', event.error);
        options.onError(event.error);
      }
      options.onEnd(); // Ensure state is reset even on error.
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth?.speaking) {
      this.synth.cancel();
    }
  }

  isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }

  cleanup() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    this.stop();
    if(this.synth) {
      this.synth.onvoiceschanged = null;
    }
  }
}

// Export a singleton instance of the service.
export const ttsService = new TTSService();