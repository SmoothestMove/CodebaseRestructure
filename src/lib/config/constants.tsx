import React from 'react';
import { Owner } from '@/types';
import { IoSettingsSharp, IoSync } from 'react-icons/io5'; 
import { FcGoogle } from 'react-icons/fc'; 
import { FaExclamationTriangle } from 'react-icons/fa';
// Environment helpers ensure required keys are present before Firebase initializes.
const ENV = import.meta.env as Record<string, string | boolean | undefined>;
const isDevEnvironment = Boolean(ENV.DEV);

const sanitizeEnvValue = (value: string): string => value.replace(/[\s\\]/g, '').trim();

type EnvLookupOptions = {
  optional?: boolean;
  fallback?: string;
};

const buildMissingEnvMessage = (key: string) => [
  `[config] Missing required environment variable "${key}".`,
  'Add it to your .env.local (see docs/development/environment.md) and restart Smooth Moves.'
].join(' ');

export const getEnvVar = (key: string, options: EnvLookupOptions = {}): string => {
  const { optional = false, fallback = '' } = options;
  const raw = ENV[key];
  const normalized = typeof raw === 'string' ? raw : raw != null ? String(raw) : '';
  const sanitized = sanitizeEnvValue(normalized);

  if (!sanitized) {
    if (optional) {
      if (isDevEnvironment) {
        console.warn(`[config] Optional environment variable "${key}" is not set.`);
      }
      return fallback;
    }
    throw new Error(buildMissingEnvMessage(key));
  }

  return sanitized;
};

export const REQUIRED_FIREBASE_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

export const firebaseConfig = Object.freeze({
  apiKey: getEnvVar(REQUIRED_FIREBASE_ENV_KEYS[0]),
  authDomain: getEnvVar(REQUIRED_FIREBASE_ENV_KEYS[1]),
  projectId: getEnvVar(REQUIRED_FIREBASE_ENV_KEYS[2]),
  storageBucket: getEnvVar(REQUIRED_FIREBASE_ENV_KEYS[3]),
  messagingSenderId: getEnvVar(REQUIRED_FIREBASE_ENV_KEYS[4]),
  appId: getEnvVar(REQUIRED_FIREBASE_ENV_KEYS[5]),
  measurementId: 'G-4NW7CSXH7S'
});

// In your authentication code, you can still use the custom domain for production
// by checking the hostname and using the appropriate domain for redirects
export const getAuthDomain = () => {
  return window.location.hostname === 'movingsmooth.com' || 
         window.location.hostname === 'www.movingsmooth.com'
    ? 'movingsmooth.com' 
    : 'smoothmoves-60679.firebaseapp.com'; // Ensure no trailing characters
};

export const LOCAL_STORAGE_KEY = 'qrToteTrackerBoxes'; 
export const OWNERS_LOCAL_STORAGE_KEY = 'smoothMovesOwners';
export const SETTINGS_LOCAL_STORAGE_KEY = 'smoothMovesSettings'; 

export const PREDEFINED_COMMUNAL_ROOMS: Owner[] = [
  { uid: 'KT', firstName: 'Kitchen', lastName: '(Communal)', color: '#FFA500', createdAt: 0 },
  { uid: 'LR', firstName: 'Living Room', lastName: '(Communal)', color: '#008000', createdAt: 0 },
  { uid: 'BR', firstName: 'Bathroom', lastName: '(Communal)', color: '#00FFFF', createdAt: 0 },
  { uid: 'DR', firstName: 'Dining Room', lastName: '(Communal)', color: '#800000', createdAt: 0 },
  { uid: 'BM', firstName: 'Basement', lastName: '(Communal)', color: '#FFC0CB', createdAt: 0 },
  { uid: 'GA', firstName: 'Garage', lastName: '(Communal)', color: '#7B3F1B', createdAt: 0 },
  { uid: 'OF', firstName: 'Office', lastName: '(Communal)', color: '#000080', createdAt: 0 },
];

const iconBaseClass = "inline-block"; // Moved declaration to the top

export const IconPlus: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const IconQrCode: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625a1.125 1.125 0 011.125-1.125h4.5a1.125 1.125 0 011.125 1.125V17.25h.008v.008h.008v.008h.008V17.25h.008v.008h.008v.008h.008V17.25h.008v.008H20.25v.008H20.25v.008h-.008V19.5h-.008v.008h-.008v.008h-.008V19.5h-.008v.008h-.008v.008H18v.008h-.008v.008h-.008V19.5h-.008v.008h-.008v.008H16.5v.008h-.008v.008h-.008V19.5h-.008v.008h-.008V19.125a1.125 1.125 0 01-1.125-1.125V14.625z" />
  </svg>
);

export const IconListBullet: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const IconChevronLeft: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const IconCamera: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

export const IconHome: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
</svg>
);

export const IconEdit: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const IconTrash: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export const IconCheck: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export const IconExternalLink: React.FC<{className?: string}> = ({ className="w-4 h-4"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

export const IconXMark: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const IconBox: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L12 12.75L21 7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25L12 12.75" />
  </svg>
);

export const IconSmoothMovesLogo: React.FC<{ className?: string }> = ({ className = "w-auto h-auto" }) => (
  <img 
    src="https://i.postimg.cc/htVfR425/SRoad.png" 
    alt="Smooth Moves Logo" 
    className={`${iconBaseClass} ${className}`} 
  />
);

export const IconLightningBolt: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconBaseClass} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

export const IconSettings: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <IoSettingsSharp className={`${iconBaseClass} ${className}`} />
);

export const IconGoogle: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <FcGoogle className={`${iconBaseClass} ${className}`} />
);

export const IconSpinner: React.FC<{className?: string}> = ({ className = "w-5 h-5 animate-spin" }) => (
  <IoSync className={`${iconBaseClass} ${className}`} />
);

export const IconWarning: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <FaExclamationTriangle className={`${iconBaseClass} ${className}`} />
);

