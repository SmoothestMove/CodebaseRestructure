/// <reference lib="es2015" />

import { PorcupineWorker } from '@picovoice/porcupine-web';
import { WebVoiceProcessor } from '@picovoice/web-voice-processor';

class WakeWordService {
  private webVoiceProcessor: WebVoiceProcessor | null = null;
  private porcupineWorker: PorcupineWorker | null = null;
  private running: boolean = false;

  /**
   * Initializes the wake word service.
   * @param {string} accessKey - The Picovoice access key.
   * @param {string} modelPublicPath - The public path to the wake word model.
   * @param {function(): void} wakeWordCallback - A callback function for when the wake word is detected.
   * @returns {Promise<void>}
   */
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

  /**
   * Stops the wake word service.
   */
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

  /**
   * Checks if the wake word service is running.
   * @returns {boolean} Whether the service is running.
   */
  isRunning(): boolean {
    return this.running;
  }
}

// Export a singleton instance of the service so the state is shared.
export const wakeWordService = new WakeWordService();