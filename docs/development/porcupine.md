# Picovoice Porcupine Notes

- Voice activation is provided by Picovoice Porcupine.
- The SDK can be redistributed in client apps under the Picovoice commercial license. See https://picovoice.ai. 
- We lazy-load the Porcupine engine and Web Voice Processor so the bundle stays small until the wake-word toggle is enabled.
- Store custom wake-word models under `public/porcupine/` and provide the path via the Settings UI.
- Keep the `VITE_PICOVOICE_ACCESS_KEY` secret in `.env.local`.
