#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_GEMINI_API_KEY',
];

const OPTIONAL_KEYS = [
  'VITE_MINDEE_API_KEY',
  'VITE_PICOVOICE_ACCESS_KEY',
];

const envFiles = ['.env.local', '.env'];
const values = new Map();

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) {
      values.set(key, value);
    }
  }
}

for (const candidate of envFiles) {
  const fullPath = path.resolve(candidate);
  if (fs.existsSync(fullPath)) {
    parseEnvFile(fullPath);
  }
}

const missing = REQUIRED_KEYS.filter(key => {
  const value = values.get(key);
  return !value || value.length === 0 || value === 'your_value_here';
});

if (missing.length > 0) {
  console.error('\u274c Missing required environment keys:\n- ' + missing.join('\n- '));
  console.error('\nPopulate .env.local (see .env.example) with the required values.');
  process.exit(1);
}

const optionalMissing = OPTIONAL_KEYS.filter(key => !values.has(key));
if (optionalMissing.length) {
  console.warn('\u26a0\ufe0f Optional API keys not found:');
  for (const key of optionalMissing) {
    console.warn(`- ${key}`);
  }
  console.warn('Provide these if you want OCR or wake-word features.');
}

console.log('\u2705 Environment configuration check passed.');
