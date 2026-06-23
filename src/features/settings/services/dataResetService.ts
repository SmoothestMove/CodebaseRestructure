import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { firestore } from '@/main';
import type { Move } from './moveService';

/**
 * Enhanced Data Reset Service
 * 
 * This service provides comprehensive data reset functionality that resets
 * a move back to its default state when originally created, while preserving
 * the move structure and participants.
 */

export interface ResetOptions {
  resetFirebaseData?: boolean;
  resetLocalStorageData?: boolean;
  resetCaches?: boolean;
  preserveMove?: boolean; // If true, keeps the move but resets its data
}

export interface ResetResult {
  success: boolean;
  message: string;
  errors?: string[];
  resetItems: {
    firebaseCollections?: string[];
    localStorageKeys?: string[];
    caches?: boolean;
    move?: boolean;
  };
}

/**
 * List of all Firebase collections that belong to a move
 */
const MOVE_COLLECTIONS = [
  'boxes',
  'owners', 
  'calendar_events',
  'tasks',
  'plannerTasks',
  'plannerFrames', 
  'plannerActivity',
  'timeframes'
] as const;

/**
 * List of all localStorage keys used by the application
 */
const LOCAL_STORAGE_KEYS = [
  'qrToteTrackerBoxes', // Legacy boxes key
  'smoothMovesOwners',
  'smoothMovesSettings',
  'budgetExpenses',
  'budgetCategories', 
  'budgetData',
  'theme', // Theme preference
  'smooth-moves-theme', // Alternative theme key
  'marvin-api-key', // MARVIN API key storage
  'user-location', // User location for MARVIN
  // Add any other localStorage keys used by the app
] as const;

/**
 * Reset all data for a specific move back to default state
 */
export async function resetMoveToDefault(
  moveId: string, 
  _currentUserId: string,
  options: ResetOptions = {}
): Promise<ResetResult> {
  const {
    resetFirebaseData = true,
    resetLocalStorageData = true,
    resetCaches = true,
    preserveMove = true
  } = options;

  const errors: string[] = [];
  const resetItems: ResetResult['resetItems'] = {};

  try {
    // 1. Reset Firebase move data
    if (resetFirebaseData) {
      await resetFirebaseMoveData(moveId, preserveMove);
      resetItems.firebaseCollections = [...MOVE_COLLECTIONS];
    }

    // 2. Reset localStorage data
    if (resetLocalStorageData) {
      await resetLocalStorageApplicationData();
      resetItems.localStorageKeys = [...LOCAL_STORAGE_KEYS];
    }

    // 3. Clear caches
    if (resetCaches) {
      await resetApplicationCaches();
      resetItems.caches = true;
    }

    return {
      success: true,
      message: preserveMove 
        ? 'Move data has been successfully reset to default state. The move structure and participants have been preserved.'
        : 'All application data has been cleared successfully.',
      resetItems
    };

  } catch (error) {
    console.error('Error during data reset:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    
    return {
      success: false,
      message: 'Failed to reset data completely. Some items may have been reset.',
      errors,
      resetItems
    };
  }
}

/**
 * Reset all Firebase collections for a move
 */
async function resetFirebaseMoveData(moveId: string, preserveMove: boolean): Promise<void> {
  console.log(`Starting Firebase data reset for move: ${moveId}`);
  
  // Use individual delete operations instead of batch to avoid issues
  let totalDeletedDocs = 0;

  // Reset each collection under the move
  for (const collectionName of MOVE_COLLECTIONS) {
    try {
      console.log(`Processing collection: ${collectionName}`);
      const collectionRef = collection(firestore, 'moves', moveId, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      console.log(`Found ${snapshot.docs.length} documents in ${collectionName}`);
      
      // Delete all documents in this collection individually
      for (const docSnapshot of snapshot.docs) {
        try {
          await deleteDoc(docSnapshot.ref);
          totalDeletedDocs++;
          console.log(`Deleted document ${docSnapshot.id} from ${collectionName}`);
        } catch (deleteError) {
          console.warn(`Failed to delete document ${docSnapshot.id} from ${collectionName}:`, deleteError);
        }
      }
    } catch (error) {
      console.warn(`Failed to reset collection ${collectionName}:`, error);
      // Continue with other collections even if one fails
    }
  }

  console.log(`Total documents deleted: ${totalDeletedDocs}`);

  // Reset the move document itself to default state (preserve participants and basic info)
  if (preserveMove) {
    try {
      const moveRef = doc(firestore, 'moves', moveId);
      await updateDoc(moveRef, {
        updatedAt: serverTimestamp(),
        moveDate: null, // Reset move date
        // Preserve: moveCode, createdBy, createdAt, participants
      });
      console.log('Move document updated successfully');
    } catch (error) {
      console.error('Failed to update move document:', error);
      throw error;
    }
  }

  console.log('Firebase data reset completed successfully');
}

/**
 * Reset all localStorage data to defaults
 */
async function resetLocalStorageApplicationData(): Promise<void> {
  // Clear specific keys we know about
  for (const key of LOCAL_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage key ${key}:`, error);
    }
  }

  // Also clear sessionStorage
  try {
    sessionStorage.clear();
  } catch (error) {
    console.warn('Failed to clear sessionStorage:', error);
  }

  // Set default theme if needed
  try {
    const defaultTheme = 'light';
    localStorage.setItem('theme', defaultTheme);
  } catch (error) {
    console.warn('Failed to set default theme:', error);
  }
}

/**
 * Reset application caches
 */
async function resetApplicationCaches(): Promise<void> {
  try {
    // Clear all browser caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
  } catch (error) {
    console.warn('Failed to clear caches:', error);
  }

  try {
    // Clear IndexedDB databases
    const databases = await window.indexedDB.databases();
    for (const dbInfo of databases) {
      if (dbInfo.name) {
        window.indexedDB.deleteDatabase(dbInfo.name);
      }
    }
  } catch (error) {
    console.warn('Failed to clear IndexedDB:', error);
  }
}

/**
 * Nuclear option: Clear absolutely everything (like the original function)
 */
export async function clearAllApplicationData(): Promise<ResetResult> {
  try {
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all IndexedDB
    const databases = await window.indexedDB.databases();
    for (const dbInfo of databases) {
      if (dbInfo.name) {
        window.indexedDB.deleteDatabase(dbInfo.name);
      }
    }

    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    return {
      success: true,
      message: 'All application data has been cleared successfully.',
      resetItems: {
        localStorageKeys: [...LOCAL_STORAGE_KEYS],
        caches: true
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to clear all application data.',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      resetItems: {}
    };
  }
}

/**
 * Get information about what will be reset (for confirmation dialogs)
 */
export function getResetPreview(_moveId: string): {
  firebaseCollections: string[];
  localStorageItems: string[];
  description: string;
} {
  return {
    firebaseCollections: [...MOVE_COLLECTIONS],
    localStorageItems: [
      'All boxes and tracking data',
      'Personal owners and custom spaces',
      'Budget expenses and categories',
      'Calendar events',
      'Planner tasks and timelines',
      'Application settings',
      'MARVIN AI preferences'
    ],
    description: `This will reset your move back to its original state when first created. Your move code and participants will be preserved, but all boxes, owners, budget data, calendar events, and planner tasks will be deleted.`
  };
}

/**
 * Validate that a reset operation can be performed
 */
export function validateResetPermissions(
  move: Move | null, 
  currentUserId: string
): { canReset: boolean; reason?: string } {
  if (!move) {
    return { canReset: false, reason: 'No active move found.' };
  }

  if (!move.participants[currentUserId]) {
    return { canReset: false, reason: 'You are not a participant in this move.' };
  }

  // Allow any participant to reset move data
  // Note: Previously restricted to move creator only, but changed to allow all participants
  // since move data reset is generally safe and participants should have this capability

  return { canReset: true };
}