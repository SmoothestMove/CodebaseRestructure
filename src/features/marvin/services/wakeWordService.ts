/// <reference lib="es2015" />

import type { PorcupineWorker } from '@picovoice/porcupine-web';
import type { WebVoiceProcessor } from '@picovoice/web-voice-processor';

class WakeWordService {
  private webVoiceProcessor: WebVoiceProcessor | null = null;
  private porcupineWorker: PorcupineWorker | null = null;
  private running: boolean = false;

  private moduleLoadPromise: Promise<void> | null = null;
  private porcupineModule: typeof import('@picovoice/porcupine-web') | null = null;
  private voiceProcessorModule: typeof import('@picovoice/web-voice-processor') | null = null;

  private async ensureModulesLoaded() {
    if (!this.moduleLoadPromise) {
      this.moduleLoadPromise = (async () => {
        const [porcupineModule, voiceProcessorModule] = await Promise.all([
          import('@picovoice/porcupine-web'),
          import('@picovoice/web-voice-processor'),
        ]);
        this.porcupineModule = porcupineModule;
        this.voiceProcessorModule = voiceProcessorModule;
      })();
    }

    await this.moduleLoadPromise;

    return {
      PorcupineWorker: this.porcupineModule!.PorcupineWorker,
      WebVoiceProcessor: this.voiceProcessorModule!.WebVoiceProcessor,
    };
  }

  async initialize(accessKey: string, modelPublicPath: string, wakeWordCallback: () => void): Promise<void> {
    if (this.running) {
      return;
    }
    
    // Validate credentials passed from the UI
    if (!accessKey) {
      console.error('Picovoice AccessKey is missing. Cannot initialize wake word detection.');
      throw new Error('Missing Picovoice AccessKey');
    }
    if (!modelPublicPath) {
      console.error('Custom wake word model file is not configured. Cannot initialize wake word detection.');
      throw new Error('Missing custom wake word model file configuration');
    }
    
    try {
      const { PorcupineWorker, WebVoiceProcessor } = await this.ensureModulesLoaded();

      this.porcupineWorker = await PorcupineWorker.create(
        accessKey,
        [{
          publicPath: modelPublicPath, // Using the direct file path from UI config
          label: "Let's Move Marvin",
          sensitivity: 0.6 // A value between 0 and 1. Higher is more sensitive.
        }],
        // This is the callback that fires when the wake word is detected.
        (keywordDetection) => {
          if (keywordDetection.label) {
            console.log(`Wake word "${keywordDetection.label}" detected.`);
            wakeWordCallback();
          }
        },
        // This callback handles errors during processing.
        { processErrorCallback: (error) => {
            console.error('Picovoice processing error:', error);
            this.stop();
          } 
        } as any
      );
    
      // Initialize the WebVoiceProcessor to manage microphone audio.
      this.webVoiceProcessor = await (WebVoiceProcessor as any).init({
        engine: this.porcupineWorker,
        start: true, // Start listening immediately
      });

      this.running = true;
      console.log('Wake word service initialized and listening for "Let\'s Move Marvin".');

    } catch (error) {
      console.error('Failed to initialize Picovoice wake word engine:', error);
      this.stop(); // Clean up on failure
      throw error; // Re-throw to be caught by the caller in Marvin.tsx
    }
  }

  stop() {
    if (this.webVoiceProcessor) {
      (this.webVoiceProcessor as any).stop();
      this.webVoiceProcessor = null;
    }
    if (this.porcupineWorker) {
      this.porcupineWorker.terminate();
      this.porcupineWorker = null;
    }
    if (this.running) {
        this.running = false;
        console.log('Wake word service stopped.');
    }
  }

  isRunning(): boolean {
    return this.running;
  }
}

// Export a singleton instance of the service so the state is shared.
export const wakeWordService = new WakeWordService();
