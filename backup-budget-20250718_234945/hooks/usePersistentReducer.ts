import { useCallback, useEffect, useReducer, useRef } from 'react';

type Reducer<S, A> = (state: S, action: A) => S;
type StorageType = 'local' | 'session';

interface UsePersistentReducerOptions<S> {
  storageKey: string;
  storageType?: StorageType;
  version?: number;
  onRehydrate?: (state: S) => S;
  onSave?: (state: S) => void;
  onError?: (error: Error) => void;
  debounceTime?: number;
}

const STORAGE_PREFIX = 'budget-tracker';

/**
 * A custom hook that persists reducer state to localStorage or sessionStorage
 * with versioning and error handling.
 */
function usePersistentReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  options: UsePersistentReducerOptions<S> | string
): [S, React.Dispatch<A>] {
  // Parse options
  const {
    storageKey,
    storageType = 'local',
    version = 1,
    onRehydrate,
    onSave,
    onError,
    debounceTime = 100,
  } = typeof options === 'string' 
    ? { storageKey: options } as UsePersistentReducerOptions<S>
    : options;

  // Get the appropriate storage
  const storage = storageType === 'session' ? window.sessionStorage : window.localStorage;
  const fullKey = `${STORAGE_PREFIX}:${storageKey}`;
  const versionKey = `${STORAGE_PREFIX}:${storageKey}:version`;
  
  // Refs for debouncing
  const saveTimeoutRef = useRef<number | null>(null);
  const initialStateRef = useRef(initialState);
  
  // Initialize state from storage or use initial state
  const getInitialState = useCallback((): S => {
    try {
      // Check version first
      const savedVersion = storage.getItem(versionKey);
      if (savedVersion && parseInt(savedVersion, 10) !== version) {
        // Version mismatch, clear saved state
        storage.removeItem(fullKey);
        storage.setItem(versionKey, version.toString());
        return initialStateRef.current;
      }
      
      // Try to get saved state
      const savedState = storage.getItem(fullKey);
      if (!savedState) {
        // No saved state, save the initial state
        saveState(initialStateRef.current);
        return initialStateRef.current;
      }
      
      // Parse the saved state
      const parsedState = JSON.parse(savedState);
      
      // Allow transformation of the parsed state before using it
      return onRehydrate ? onRehydrate(parsedState) : parsedState;
    } catch (error) {
      console.error('Error reading from storage:', error);
      if (onError) {
        onError(error as Error);
      }
      return initialStateRef.current;
    }
  }, [fullKey, versionKey, version, storage, onRehydrate, onError]);

  // Save state to storage with debouncing
  const saveState = useCallback((state: S) => {
    try {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = window.setTimeout(() => {
        try {
          const serializedState = JSON.stringify(state);
          storage.setItem(fullKey, serializedState);
          storage.setItem(versionKey, version.toString());
          
          if (onSave) {
            onSave(state);
          }
        } catch (error) {
          console.error('Error saving to storage:', error);
          if (onError) {
            onError(error as Error);
          }
        }
      }, debounceTime);
    } catch (error) {
      console.error('Error in saveState:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  }, [fullKey, versionKey, version, storage, onSave, onError, debounceTime]);

  // Create a reducer that saves state after each action
  const persistentReducer = useCallback((state: S, action: A): S => {
    try {
      const newState = reducer(state, action);
      saveState(newState);
      return newState;
    } catch (error) {
      console.error('Error in reducer:', error);
      if (onError) {
        onError(error as Error);
      }
      return state;
    }
  }, [reducer, saveState, onError]);

  // Initialize state
  const [state, dispatch] = useReducer(persistentReducer, undefined, getInitialState);

  // Save state when component unmounts
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveState(state);
    };
  }, [state, saveState]);

  // Listen for storage events to sync state across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === fullKey && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue);
          dispatch({ type: '@@INIT' } as unknown as A);
        } catch (error) {
          console.error('Error parsing storage event data:', error);
          if (onError) {
            onError(error as Error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fullKey, onError]);

  return [state, dispatch];
}

export default usePersistentReducer;
