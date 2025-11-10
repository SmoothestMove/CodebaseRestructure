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

interface TTSState {
  isInitialized: boolean;
  requiresUserInteraction: boolean;
  hasTriedUserInteraction: boolean;
}

/**
 * A service for handling text-to-speech functionality.
 * @class
 */
class TTSService {
  private synth: SpeechSynthesis | null;
  private voices: SpeechSynthesisVoice[] = [];
  private keepAliveInterval: number | null = null;
  private state: TTSState = {
    isInitialized: false,
    requiresUserInteraction: false,
    hasTriedUserInteraction: false
  };
  private voiceLoadRetries = 0;
  private maxVoiceLoadRetries = 3;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      
      // Detect mobile browsers that require user interaction
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      this.state.requiresUserInteraction = isMobile || isSafari;
    } else {
      this.synth = null;
      console.warn('Speech Synthesis not supported in this browser.');
    }
  }

  /**
   * Initializes the service.
   * @param {function(): void} onVoicesChanged - A callback function for when the voices change.
   */
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
    
    const newVoices = this.synth.getVoices();
    
    // Retry loading if no voices found and we haven't exceeded retry limit
    if (newVoices.length === 0 && this.voiceLoadRetries < this.maxVoiceLoadRetries) {
      this.voiceLoadRetries++;
      setTimeout(() => this.loadVoices(), 500);
      return;
    }
    
    this.voices = newVoices;
    this.state.isInitialized = true;
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

  /**
   * Gets the available voices.
   * @returns {SpeechSynthesisVoice[]} A list of available voices.
   */
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
  
  /**
   * Gets the default voice URI.
   * @returns {string | null} The default voice URI, or null if no voices are available.
   */
  getDefaultVoiceURI(): string | null {
    const voices = this.getAvailableVoices();
    return voices.length > 0 ? voices[0].voiceURI : null;
  }

  /**
   * Speaks the given text.
   * @param {string} text - The text to speak.
   * @param {string | null} voiceURI - The URI of the voice to use.
   * @param {SpeakOptions} options - The options for speaking.
   */
  speak(text: string, voiceURI: string | null, options: SpeakOptions) {
    console.log('ttsService.speak() called:', {
      hasText: !!text.trim(),
      hasSynth: !!this.synth,
      voicesCount: this.voices.length,
      requiresUserInteraction: this.state.requiresUserInteraction,
      hasTriedUserInteraction: this.state.hasTriedUserInteraction,
      isSpeaking: this.synth?.speaking
    });
    
    if (!this.synth || !text.trim()) {
      console.log('ttsService early exit: no synth or empty text');
      options.onEnd();
      return;
    }

    // Check if we need user interaction on mobile/Safari
    if (this.state.requiresUserInteraction && !this.state.hasTriedUserInteraction) {
      console.log('Attempting user interaction workaround for mobile/Safari');
      this.state.hasTriedUserInteraction = true;
      // Try a silent utterance first to enable speech synthesis
      const testUtterance = new SpeechSynthesisUtterance(' ');
      testUtterance.volume = 0;
      testUtterance.onend = () => {
        console.log('Silent test utterance completed, now trying actual speech');
        // Now try the actual speech
        this.createAndSpeak(text, voiceURI, options);
      };
      testUtterance.onerror = () => {
        console.log('Silent test utterance failed');
        options.onError('Speech requires user interaction on this device');
      };
      this.synth.speak(testUtterance);
      return;
    }

    // Robustly stop any previous speech before starting a new one.
    if (this.synth.speaking) {
      console.log('Canceling previous speech, will retry in 100ms');
      this.synth.cancel();
      
      // A brief timeout allows the cancel command to process fully.
      setTimeout(() => this.createAndSpeak(text, voiceURI, options), 100);
    } else {
      console.log('No previous speech detected, creating new utterance');
      this.createAndSpeak(text, voiceURI, options);
    }
  }
  
  private createAndSpeak(text: string, voiceURI: string | null, options: SpeakOptions, retryCount = 0) {
    console.log('createAndSpeak() called:', {
      textLength: text.length,
      voiceURI,
      retryCount,
      availableVoices: this.voices.length
    });
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find voice with fallback to default or first available
    const voice = this.voices.find(v => v.voiceURI === voiceURI) || 
                  this.voices.find(v => v.default) ||
                  this.voices[0];
    
    console.log('Voice selection:', {
      requestedVoiceURI: voiceURI,
      foundVoice: voice ? voice.name : 'none',
      voiceIsDefault: voice?.default,
      totalVoices: this.voices.length
    });
    
    if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
    } else if (this.voices.length === 0 && retryCount < 2) {
        console.log('No voices available, retrying voice load in 300ms');
        // Voices not loaded yet, retry after a brief delay
        setTimeout(() => {
            this.loadVoices();
            this.createAndSpeak(text, voiceURI, options, retryCount + 1);
        }, 300);
        return;
    }
    
    utterance.onstart = () => {
        console.log('SpeechSynthesisUtterance onstart fired');
        options.onStart();
    };
    
    utterance.onend = () => {
        console.log('SpeechSynthesisUtterance onend fired');
        // Failsafe: Ensure the speaking state is false even if the browser doesn't fire events correctly.
        if (this.synth?.speaking) {
            this.synth.cancel();
        }
        options.onEnd();
    };
    
    utterance.onerror = (event) => {
      console.log('SpeechSynthesisUtterance onerror fired:', event.error);
      // 'interrupted' and 'canceled' are expected when we stop speech manually.
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Speech synthesis error:', event.error);
        
        // Retry once for certain errors
        if (retryCount === 0 && (event.error === 'network' || event.error === 'synthesis-failed')) {
          console.log('Retrying speech synthesis due to recoverable error');
          setTimeout(() => {
            this.createAndSpeak(text, voiceURI, options, retryCount + 1);
          }, 500);
          return;
        }
        
        options.onError(event.error);
      }
      options.onEnd(); // Ensure state is reset even on error.
    };

    if (!this.synth) {
      console.log('No speech synthesis available');
      options.onError('Speech synthesis not available');
      return;
    }

    console.log('Calling synth.speak() with utterance');
    this.synth.speak(utterance);
  }

  /**
   * Stops the speech synthesis.
   */
  stop() {
    if (this.synth?.speaking) {
      this.synth.cancel();
    }
  }

  /**
   * Checks if the speech synthesis is currently speaking.
   * @returns {boolean} Whether the speech synthesis is speaking.
   */
  isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }

  /**
   * Cleans up the service.
   */
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